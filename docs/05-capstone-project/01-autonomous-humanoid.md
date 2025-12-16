---
id: capstone-project-autonomous-humanoid
title: Capstone Project - Autonomous Humanoid
sidebar_label: Capstone Project
slug: /capstone-project/autonomous-humanoid
---

# Capstone Project: Autonomous Humanoid

The Capstone Project is the culmination of your learning throughout this book. You will apply the knowledge and skills gained from all modules to develop an autonomous humanoid robot that can perform a complex task in a simulated environment.

## Project Goal

The goal of this project is to design, implement, and demonstrate an autonomous humanoid robot capable of performing a complex task.

### Perception
The robot must be able to perceive its environment using simulated sensors, such as cameras and LiDAR, to understand its surroundings.

### Decision Making
The robot must be able to make intelligent decisions based on sensory input and high-level commands, utilizing AI/ML models, including VLA models.

### Physical Action
The robot must be able to execute physical actions by controlling its kinematics and locomotion to achieve desired movements and interactions.

### Conversational Interaction
The robot must be able to engage in basic conversation, understanding and responding to simple voice commands using speech recognition and natural language processing.

## Project Deliverables

### Design Document
A detailed plan outlining your robot's architecture, chosen algorithms, and implementation strategy.

### Codebase
Well-documented and functional code for your autonomous humanoid.

### Demonstration Video
A video showcasing your robot performing the specified task in Isaac Sim or Gazebo.

### Technical Report
A written report summarizing your approach, challenges faced, and results.

## Suggested Technologies

### ROS/ROS 2
For inter-process communication and robotic middleware.

### NVIDIA Isaac Sim/Gazebo
For high-fidelity physics simulation and synthetic data generation.

### VLA Models
For perception, language understanding, and action generation.

### Whisper
For speech recognition.

## Evaluation Criteria

### Task Complexity and Robustness
Your project will be evaluated based on the complexity of the task you choose to solve and the robustness of your implementation.

### Design Clarity and Documentation
The clarity of your design and the quality of your documentation will also be a major factor in your grade.

### Demonstration and Presentation
Your ability to effectively demonstrate your robot's capabilities and to present your work in a clear and concise manner will be a key part of your evaluation.

<h3>Example: End-to-End Voice Command → Navigation → Manipulation Pipeline</h3>

This Python script outlines a full integrated pipeline for an autonomous humanoid, combining voice command processing (Whisper + GPT-4o), navigation (Nav2 integration), and manipulation (using a generic manipulation action). This serves as a high-level conceptual framework for your Capstone project.

**Prerequisites:**
-   An OpenAI API key set as an environment variable (`OPENAI_API_KEY`).
-   ROS 2 installed and sourced.
-   `rclpy` for Python ROS 2 nodes.
-   `openai` Python library (`pip install openai`).
-   `sounddevice` or similar for audio capture (`pip install sounddevice numpy`).
-   Custom ROS 2 Action definitions for Navigation (e.g., `NavigateToPose.action`) and Manipulation (e.g., `PerformManipulation.action`).
-   A running Nav2 stack for navigation.
-   A robot in a simulated environment (Gazebo/Isaac Sim) with corresponding ROS 2 interfaces.

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from rclpy.action.client import ClientGoalHandle
from rclpy.callback_groups import ReentrantCallbackGroup
from rclpy.executors import MultiThreadedExecutor

import openai
import os
import time
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wavfile
import json
from threading import Thread

# --- Custom ROS 2 Action Imports (define these in your workspace) ---
# Example: my_robot_interfaces/action/NavigateToPose.action
# geometry_msgs/PoseStamped pose
# ---
# string status_message
# bool success
# ---
# float32 distance_remaining
from my_robot_interfaces.action import NavigateToPose

# Example: my_robot_interfaces/action/PerformManipulation.action
# string command_type # e.g., "grasp", "place", "reach"
# float32[] params    # e.g., [x, y, z] for target pose, [object_id] for grasp
# ---
# string status_message
# bool success
# ---
# float32 progress
from my_robot_interfaces.action import PerformManipulation


# --- Configuration ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

WHISPER_MODEL = "whisper-1" # Or other suitable Whisper model
GPT_MODEL = "gpt-4o"       # Using GPT-4o for NLU and action planning

# --- Helper Functions for OpenAI API ---

def record_audio(duration_seconds=5, filename="capstone_command.wav", samplerate=16000):
    """Records audio from the microphone."""
    print(f"Recording {duration_seconds} seconds of audio...")
    try:
        recording = sd.rec(int(duration_seconds * samplerate), samplerate=samplerate, channels=1, dtype='int16')
        sd.wait()
        wavfile.write(filename, samplerate, recording)
        print(f"Audio recorded to {filename}")
        return filename
    except Exception as e:
        print(f"Error recording audio: {e}")
        return None

def transcribe_audio_with_whisper(audio_file_path):
    """Transcribes audio to text using OpenAI Whisper API."""
    if not audio_file_path or not os.path.exists(audio_file_path):
        return "Error: No valid audio file for transcription."
    
    print(f"Transcribing '{audio_file_path}' with Whisper...")
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        with open(audio_file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model=WHISPER_MODEL,
                file=audio_file
            )
        return transcript.text
    except Exception as e:
        return f"Error transcribing audio: {e}"

def get_robot_tasks_from_gpt(text_command, vision_description=""):
    """Generates a sequence of robot tasks (navigation, manipulation) using GPT-4o."""
    print(f"Generating robot tasks with {GPT_MODEL}...")
    try:
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        messages = [
            {"role": "system", "content": """
                You are an autonomous humanoid robot. Interpret user commands and visual context 
                to generate a sequence of structured JSON tasks. 
                Respond ONLY with a JSON array of tasks.
                Available tasks:
                1. {"task_type": "navigate", "target_pose": {"x": float, "y": float, "yaw": float}, "description": "go to location"}
                2. {"task_type": "manipulate", "command": "grasp"|"place"|"reach", "params": [float,...], "description": "perform manipulation"}
                3. {"task_type": "report_status", "message": "status string"}
                Consider visual description for context. If unclear, respond with an empty array."""},
            {"role": "user", "content": f"User command: {text_command}\nVisual context: {vision_description}"}
        ]
        
        response = client.chat.completions.create(
            model=GPT_MODEL,
            messages=messages,
            response_format={"type": "json_object"}, # Expecting a JSON object containing the array
            max_tokens=500 # Adjust as needed for task complexity
        )
        return response.choices[0].message.content
    except Exception as e:
        return f'{{"error": "Failed to generate tasks: {e}"}}'

# --- ROS 2 Node for Orchestration ---
class CapstoneOrchestratorNode(Node):

    def __init__(self):
        super().__init__('capstone_orchestrator_node')
        self.callback_group_nav = ReentrantCallbackGroup()
        self.callback_group_manip = ReentrantCallbackGroup()
        
        self.nav_action_client = ActionClient(self, NavigateToPose, 'navigate_to_pose', callback_group=self.callback_group_nav)
        self.manip_action_client = ActionClient(self, PerformManipulation, 'perform_manipulation', callback_group=self.callback_group_manip)
        
        self.get_logger().info('Capstone Orchestrator Node started.')
        self.current_tasks = []
        self.active_goal_future = None

    def process_voice_command(self, text_command, vision_description=""):
        gpt_response_json_str = get_robot_tasks_from_gpt(text_command, vision_description)
        try:
            response_obj = json.loads(gpt_response_json_str)
            if "error" in response_obj:
                self.get_logger().error(f"GPT Error: {response_obj['error']}")
                return
            
            # Assuming GPT returns a JSON object with a 'tasks' key that is an array
            self.current_tasks = response_obj.get("tasks", []) 
            if not self.current_tasks:
                self.get_logger().warn("GPT returned no executable tasks.")
                return

            self.get_logger().info(f"Received {len(self.current_tasks)} tasks from GPT.")
            self.execute_next_task()

        except json.JSONDecodeError as e:
            self.get_logger().error(f"Failed to parse GPT response JSON: {e}")
        except Exception as e:
            self.get_logger().error(f"Error in process_voice_command: {e}")

    def execute_next_task(self):
        if self.active_goal_future and not self.active_goal_future.done():
            self.get_logger().info("Previous task still active, waiting...")
            return

        if not self.current_tasks:
            self.get_logger().info("All tasks completed or no tasks to execute.")
            self.active_goal_future = None
            return

        task = self.current_tasks.pop(0)
        task_type = task.get("task_type")
        description = task.get("description", "No description")

        self.get_logger().info(f"Executing task: {description} (Type: {task_type})")

        if task_type == "navigate":
            target_pose = task.get("target_pose")
            if target_pose:
                self.send_navigate_goal(target_pose["x"], target_pose["y"], target_pose["yaw"])
            else:
                self.get_logger().error(f"Navigation task missing target_pose: {task}")
                self.execute_next_task() # Move to next task if current is malformed
        elif task_type == "manipulate":
            command = task.get("command")
            params = task.get("params", [])
            if command:
                self.send_manipulate_goal(command, params)
            else:
                self.get_logger().error(f"Manipulation task missing command: {task}")
                self.execute_next_task()
        elif task_type == "report_status":
            message = task.get("message", "No specific status to report.")
            self.get_logger().info(f"Robot Status Report: {message}")
            self.execute_next_task() # Report status is typically non-blocking
        else:
            self.get_logger().error(f"Unknown task type: {task_type}")
            self.execute_next_task()

    # --- Navigation Action Client Callbacks ---
    def send_navigate_goal(self, x, y, yaw):
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = 'map' # Assuming navigation in map frame
        goal_msg.pose.pose.position.x = float(x)
        goal_msg.pose.pose.position.y = float(y)
        # Convert yaw (degrees) to quaternion for orientation
        q = self.euler_to_quaternion(0, 0, np.radians(yaw))
        goal_msg.pose.pose.orientation.x = q[0]
        goal_msg.pose.pose.orientation.y = q[1]
        goal_msg.pose.pose.orientation.z = q[2]
        goal_msg.pose.pose.orientation.w = q[3]

        self.nav_action_client.wait_for_server()
        self.active_goal_future = self.nav_action_client.send_goal_async(goal_msg, feedback_callback=self.navigate_feedback_callback)
        self.active_goal_future.add_done_callback(self.navigate_response_callback)

    def navigate_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Navigation goal rejected :(')
            self.active_goal_future = None # Clear active goal
            self.execute_next_task()
            return

        self.get_logger().info('Navigation goal accepted :)
')
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.navigate_result_callback)

    def navigate_result_callback(self, future):
        result = future.result().result
        if result.success:
            self.get_logger().info(f'Navigation successful: {result.status_message}')
        else:
            self.get_logger().error(f'Navigation failed: {result.status_message}')
        self.active_goal_future = None # Clear active goal
        self.execute_next_task() # Proceed to next task

    def navigate_feedback_callback(self, feedback_msg):
        self.get_logger().info(f'Navigation Feedback: Distance remaining {feedback_msg.feedback.distance_remaining:.2f} m')

    # --- Manipulation Action Client Callbacks ---
    def send_manipulate_goal(self, command_type, params):
        goal_msg = PerformManipulation.Goal()
        goal_msg.command_type = command_type
        goal_msg.params = [float(p) for p in params]

        self.manip_action_client.wait_for_server()
        self.active_goal_future = self.manip_action_client.send_goal_async(goal_msg, feedback_callback=self.manipulate_feedback_callback)
        self.active_goal_future.add_done_callback(self.manipulate_response_callback)

    def manipulate_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Manipulation goal rejected :(')
            self.active_goal_future = None
            self.execute_next_task()
            return

        self.get_logger().info('Manipulation goal accepted :)
')
        self.active_goal_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.manipulate_result_callback)

    def manipulate_result_callback(self, future):
        result = future.result().result
        if result.success:
            self.get_logger().info(f'Manipulation successful: {result.status_message}')
        else:
            self.get_logger().error(f'Manipulation failed: {result.status_message}')
        self.active_goal_future = None
        self.execute_next_task()

    def manipulate_feedback_callback(self, feedback_msg):
        self.get_logger().info(f'Manipulation Feedback: Progress {feedback_msg.feedback.progress:.2f}')

    # --- Utility ---
    def euler_to_quaternion(self, roll, pitch, yaw):
        # Convert Euler angles to quaternion
        qx = np.sin(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) - np.cos(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)
        qy = np.cos(roll/2) * np.sin(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.cos(pitch/2) * np.sin(yaw/2)
        qz = np.cos(roll/2) * np.cos(pitch/2) * np.sin(yaw/2) - np.sin(roll/2) * np.sin(pitch/2) * np.cos(yaw/2)
        qw = np.cos(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)
        return [qx, qy, qz, qw]


def main(args=None):
    rclpy.init(args=args)
    executor = MultiThreadedExecutor()
    orchestrator = CapstoneOrchestratorNode()
    executor.add_node(orchestrator)

    audio_file = None
    try:
        while rclpy.ok(): # Keep running until ROS 2 is shut down
            print("\n--- Awaiting Voice Command ---")
            audio_file = record_audio(duration_seconds=5)
            if audio_file:
                transcribed_text = transcribe_audio_with_whisper(audio_file)
                orchestrator.get_logger().info(f"Transcribed Text: '{transcribed_text}'")

                # In a real system, you might get vision_description from a perception node
                vision_description = "There is a red cube at [0.5, 0.2, 0.1] on the table." 
                orchestrator.process_voice_command(transcribed_text, vision_description)

            # Spin the executor to process callbacks and futures
            executor.spin_once(timeout_sec=1.0) # Process callbacks periodically

            if audio_file and os.path.exists(audio_file):
                os.remove(audio_file) # Clean up recorded audio file

    except KeyboardInterrupt:
        orchestrator.get_logger().info("Shutting down orchestrator.")
    finally:
        if orchestrator.manip_action_client._get_result_future is not None: # check if future exists
            orchestrator.manip_action_client._get_result_future.cancel() # Cancel outstanding manipulation future
        if orchestrator.nav_action_client._get_result_future is not None: # check if future exists
            orchestrator.nav_action_client._get_result_future.cancel() # Cancel outstanding navigation future

        orchestrator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```