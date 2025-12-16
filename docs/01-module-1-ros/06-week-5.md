---
id: module-1-ros-urdf-python-packages
title: URDF and Python Packages
sidebar_label: URDF and Python Packages
slug: /module-1-ros/urdf-python-packages
---

# Module 1: ROS - URDF and Python Packages

This section will focus on two important aspects of ROS development: defining robot models using URDF and creating custom Python packages to organize our code.

## Unified Robot Description Format (URDF)

-   **What is URDF?**: An XML format for representing a robot model.
-   **Key Elements**: Understanding `<robot>`, `<link>`, `<joint>`, and `<visual>` tags.
-   **Creating a Simple URDF**: Step-by-step guide to creating a URDF for a simple robot.
-   **Visualizing in RViz**: How to visualize your robot model in RViz.

### Example: Simple 2-Link Arm URDF

Here's an example of a basic URDF for a 2-link robotic arm. This XML defines the physical and kinematic properties of the robot.

```xml
<?xml version="1.0"?>
<robot name="simple_arm">

  <!-- Base Link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.1 0.1 0.1"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.1 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.0001" ixy="0.0" ixz="0.0" iyy="0.0001" izz="0.0001"/>
    </inertial>
  </link>

  <!-- Joint 1 -->
  <joint name="joint1" type="revolute">
    <parent link="base_link"/>
    <child link="link1"/>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" velocity="0.5" effort="10"/>
  </joint>

  <!-- Link 1 -->
  <link name="link1">
    <visual>
      <geometry>
        <cylinder radius="0.02" length="0.2"/>
      </geometry>
      <material name="green">
        <color rgba="0 0.8 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.02" length="0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.05"/>
      <inertia ixx="0.00005" ixy="0.0" ixz="0.0" iyy="0.00005" izz="0.00005"/>
    </inertial>
  </link>

  <!-- Joint 2 -->
  <joint name="joint2" type="revolute">
    <parent link="link1"/>
    <child link="link2"/>
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" velocity="0.5" effort="10"/>
  </joint>

  <!-- Link 2 -->
  <link name="link2">
    <visual>
      <geometry>
        <box size="0.02 0.02 0.2"/>
      </geometry>
      <material name="red">
        <color rgba="0.8 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.02 0.02 0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.03"/>
      <inertia ixx="0.00003" ixy="0.0" ixz="0.0" iyy="0.00003" izz="0.00003"/>
    </inertial>
  </link>

</robot>
```

**Explanation of the URDF Structure:**
This URDF defines a simple 2-link robotic arm with a `base_link` and two actuated links (`link1`, `link2`) connected by revolute joints. Each link defines its visual, collision, and inertial properties. Joints connect these links, specifying their types and motion limits. This example provides a foundational structure for defining robotic manipulators.

---

## Creating ROS Python Packages

-   **Package Structure**: The standard directory structure for a ROS Python package.
-   **`package.xml` and `setup.py`**: Defining package metadata and dependencies.
-   **Creating a Simple Package**: Building a package with a publisher and subscriber node.
-   **Best Practices**: Tips for organizing your code and managing dependencies.



---

### Example: `rclpy` Action Client/Server for a Simple Task (Counting)

This example implements a basic ROS 2 Action for a "Count" task. The server counts up to a specified goal, providing feedback along the way. The client requests a count and displays feedback and the final result.

**1. Define the Action (`count.action` in `my_robot_interfaces/action`):**
```
# my_robot_interfaces/action/Count.action
int32 target_count
---
int32 final_count
---
int32 current_count
```

**2. Action Server (`count_action_server.py`):**
```python
import rclpy
from rclpy.action import ActionServer
from rclpy.node import Node
from my_robot_interfaces.action import Count # Import your custom action

class CountActionServer(Node):

    def __init__(self):
        super().__init__('count_action_server')
        self._action_server = ActionServer(
            self,
            Count,
            'count_up',
            self.execute_callback)
        self.get_logger().info('Action server "count_up" started.')

    def execute_callback(self, goal_handle):
        self.get_logger().info(f'Executing goal: counting to {goal_handle.request.target_count}...')

        feedback_msg = Count.Feedback()
        feedback_msg.current_count = 0

        for i in range(goal_handle.request.target_count):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled.')
                return Count.Result() # Return an empty result or specific canceled result

            feedback_msg.current_count = i + 1
            goal_handle.publish_feedback(feedback_msg)
            self.get_logger().info(f'Feedback: current count {feedback_msg.current_count}')
            self.get_clock().sleep_for_nanoseconds(1_000_000_000) # Simulate work (1 second)

        goal_handle.succeed()
        result = Count.Result()
        result.final_count = goal_handle.request.target_count
        self.get_logger().info(f'Goal succeeded: final count {result.final_count}')
        return result

def main(args=None):
    rclpy.init(args=args)
    action_server = CountActionServer()
    rclpy.spin(action_server)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**3. Action Client (`count_action_client.py`):**
```python
import rclpy
from rclpy.action import ActionClient
from rclpy.node import Node
from my_robot_interfaces.action import Count # Import your custom action
import sys

class CountActionClient(Node):

    def __init__(self):
        super().__init__('count_action_client')
        self._action_client = ActionClient(self, Count, 'count_up')
        self.get_logger().info('Action client for "count_up" started.')

    def send_goal(self, target_count):
        self.get_logger().info('Waiting for action server...')
        self._action_client.wait_for_server()

        goal_msg = Count.Goal()
        goal_msg.target_count = target_count

        self.get_logger().info(f'Sending goal request to count to {target_count}...')
        self._send_goal_future = self._action_client.send_goal_async(goal_msg, feedback_callback=self.feedback_callback)
        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Goal rejected :(')
            return

        self.get_logger().info('Goal accepted :)')
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_result_callback(self.get_result_callback)

    def get_result_callback(self, future):
        result = future.result().result
        self.get_logger().info(f'Action Result: Final Count {result.final_count}')
        rclpy.shutdown() # Shutdown the client node after receiving result

    def feedback_callback(self, feedback_msg):
        self.get_logger().info(f'Feedback: Current Count {feedback_msg.feedback.current_count}')

def main(args=None):
    rclpy.init(args=args)

    if len(sys.argv) != 2:
        print('Usage: ros2 run <your_package_name> count_action_client <target_count>')
        sys.exit(1)

    target_count = int(sys.argv[1])
    action_client = CountActionClient()
    action_client.send_goal(target_count)

    rclpy.spin(action_client)

if __name__ == '__main__':
    main()
```

**To Run These Examples:**
1.  **Create Action Definition**: In a ROS 2 package (e.g., `my_robot_interfaces`), create `action/Count.action` with the content above.
2.  **Add to `setup.py`**: Ensure `my_robot_interfaces`'s `setup.py` builds the action.
3.  **Save Scripts**: Save `count_action_server.py` and `count_action_client.py` (e.g., in your package's `nodes` directory).
4.  **Build**: `colcon build --packages-select <your_package_name>`
5.  **Run Server**: `ros2 run <your_package_name> count_action_server`
6.  **Run Client**: `ros2 run <your_package_name> count_action_client 10`

---

### Full Humanoid URDF Example (including basic legs)

This is a more comprehensive example of a humanoid URDF, including a base, torso, head, two arms, and basic legs. This illustrates how multiple links and joints are connected to form a complex robot.

```xml
<?xml version="1.0"?>
<robot name="humanoid_robot">

  <!-- Materials (optional, for better visualization in RViz) -->
  <material name="grey">
    <color rgba="0.7 0.7 0.7 1"/>
  </material>
  <material name="blue">
    <color rgba="0.0 0.0 0.8 1"/>
  </material>
  <material name="white">
    <color rgba="1.0 1.0 1.0 1"/>
  </material>
  <material name="red">
    <color rgba="0.8 0.0 0.0 1"/>
  </material>

  <!-- Base Link (Pelvis/Hip area) -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.2 0.3 0.1"/>
      </geometry>
      <material name="grey"/>
    </visual>
    <collision>
      <geometry>
        <box size="0.2 0.3 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" izz="0.1"/>
    </inertial>
  </link>

  <!-- Torso Joint and Link -->
  <joint name="torso_joint" type="fixed">
    <parent link="base_link"/>
    <child link="torso_link"/>
    <origin xyz="0 0 0.15" rpy="0 0 0"/>
  </joint>
  <link name="torso_link">
    <visual>
      <geometry>
        <box size="0.2 0.3 0.4"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <box size="0.2 0.3 0.4"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="10.0"/>
      <origin xyz="0 0 0.2" rpy="0 0 0"/>
      <inertia ixx="0.5" ixy="0.0" ixz="0.0" iyy="0.5" izz="0.5"/>
    </inertial>
  </link>

  <!-- Head Joint and Link -->
  <joint name="head_joint" type="revolute">
    <parent link="torso_link"/>
    <child link="head_link"/>
    <origin xyz="0 0 0.25" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" velocity="0.5" effort="10"/>
  </joint>
  <link name="head_link">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
      <material name="white"/>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <inertia ixx="0.01" ixy="0.0" ixz="0.0" iyy="0.01" izz="0.01"/>
    </inertial>
  </link>

  <!-- Right Arm -->
  <joint name="right_shoulder_joint" type="revolute">
    <parent link="torso_link"/>
    <child link="right_upper_arm_link"/>
    <origin xyz="0 0.2 0.15" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" velocity="0.5" effort="10"/>
  </joint>
  <link name="right_upper_arm_link">
    <visual>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
      <material name="grey"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <origin xyz="0 0 0.15" rpy="0 0 0"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" izz="0.005"/>
    </inertial>
  </link>

  <joint name="right_elbow_joint" type="revolute">
    <parent link="right_upper_arm_link"/>
    <child link="right_forearm_link"/>
    <origin xyz="0 0 0.15" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" velocity="0.5" effort="10"/>
  </joint>
  <link name="right_forearm_link">
    <visual>
      <geometry>
        <cylinder radius="0.03" length="0.25"/>
      </geometry>
      <material name="grey"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.03" length="0.25"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.3"/>
      <origin xyz="0 0 0.125" rpy="0 0 0"/>
      <inertia ixx="0.002" ixy="0.0" ixz="0.0" iyy="0.002" izz="0.002"/>
    </inertial>
  </link>

  <!-- Left Arm (mirror of right arm for simplicity) -->
  <joint name="left_shoulder_joint" type="revolute">
    <parent link="torso_link"/>
    <child link="left_upper_arm_link"/>
    <origin xyz="0 -0.2 0.15" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" velocity="0.5" effort="10"/>
  </joint>
  <link name="left_upper_arm_link">
    <visual>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
      <material name="grey"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <origin xyz="0 0 0.15" rpy="0 0 0"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" izz="0.005"/>
    </inertial>
  </link>

  <joint name="left_elbow_joint" type="revolute">
    <parent link="left_upper_arm_link"/>
    <child link="left_forearm_link"/>
    <origin xyz="0 0 0.15" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" velocity="0.5" effort="10"/>
  </joint>
  <link name="left_forearm_link">
    <visual>
      <geometry>
        <cylinder radius="0.03" length="0.25"/>
      </geometry>
      <material name="grey"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.03" length="0.25"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.3"/>
      <origin xyz="0 0 0.125" rpy="0 0 0"/>
      <inertia ixx="0.002" ixy="0.0" ixz="0.0" iyy="0.002" izz="0.002"/>
    </inertial>
  </link>

  <!-- Right Leg -->
  <joint name="right_hip_joint" type="revolute">
    <parent link="base_link"/>
    <child link="right_thigh_link"/>
    <origin xyz="0 -0.1 0" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" velocity="0.5" effort="10"/>
  </joint>
  <link name="right_thigh_link">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.4"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.4"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <origin xyz="0 0 -0.2" rpy="0 0 0"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0" iyy="0.02" izz="0.02"/>
    </inertial>
  </link>

  <joint name="right_knee_joint" type="revolute">
    <parent link="right_thigh_link"/>
    <child link="right_shin_link"/>
    <origin xyz="0 0 -0.4" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" velocity="0.5" effort="10"/>
  </joint>
  <link name="right_shin_link">
    <visual>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.5"/>
      <origin xyz="0 0 -0.15" rpy="0 0 0"/>
      <inertia ixx="0.01" ixy="0.0" ixz="0.0" iyy="0.01" izz="0.01"/>
    </inertial>
  </link>

  <!-- Left Leg (mirror of right leg) -->
  <joint name="left_hip_joint" type="revolute">
    <parent link="base_link"/>
    <child link="left_thigh_link"/>
    <origin xyz="0 0.1 0" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" velocity="0.5" effort="10"/>
  </joint>
  <link name="left_thigh_link">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.4"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.4"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <origin xyz="0 0 -0.2" rpy="0 0 0"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0" iyy="0.02" izz="0.02"/>
    </inertial>
  </link>

  <joint name="left_knee_joint" type="revolute">
    <parent link="left_thigh_link"/>
    <child link="left_shin_link"/>
    <origin xyz="0 0 -0.4" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" velocity="0.5" effort="10"/>
  </joint>
  <link name="left_shin_link">
    <visual>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.04" length="0.3"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.5"/>
      <origin xyz="0 0 -0.15" rpy="0 0 0"/>
      <inertia ixx="0.01" ixy="0.0" ixz="0.0" iyy="0.01" izz="0.01"/>
    </inertial>
  </link>

</robot>
```

**Explanation of the Humanoid URDF Structure:**
This URDF defines a simple humanoid with a `base_link` (pelvis), `torso_link`, `head_link`, two arms (upper and forearm links), and two legs (thigh and shin links). Each link defines its visual, collision, and inertial properties. Joints connect these links, specifying their types (e.g., `fixed`, `revolute`) and motion limits. Materials are also defined for better visualization. This example provides a foundational structure for more complex humanoid models, allowing for further development of locomotion and manipulation capabilities.

---

## Practice Exercises

1.  **URDF Visualizer**: Use `urdf_to_graphiz` or `xacro` along with RViz to visualize the humanoid URDF provided. Experiment with changing joint states to see the robot move.
2.  **URDF for Legged Robot**: Design a URDF for a simple quadruped (four-legged) robot. Focus on defining the base, four legs, and the necessary joints for walking.
3.  **URDF Kinetic Parameters**: Explain the significance of the `inertial` tag (mass and inertia matrix) in a URDF. How do these parameters influence the physics simulation of the robot?
4.  **Python URDF Parser**: Write a Python script (outside of ROS) that can parse a simple URDF file and extract information about its links and joints.
5.  **Robot State Publisher Node**: Create a ROS 2 Python node that publishes static joint states for a simplified version of the humanoid robot. Use this to display the robot in a fixed pose in RViz 2.

---

## Quiz Questions

1.  What is the primary function of a `<joint>` tag in URDF?
    <details>
      <summary>Answer</summary>
      The `<joint>` tag defines the connection between two `<link>` elements in a robot. It specifies the type of joint (e.g., revolute, prismatic, fixed), its parent and child links, and its motion properties.
    </details>

2.  What is the difference between a `fixed` joint and a `revolute` joint?
    <details>
      <summary>Answer</summary>
      A `fixed` joint represents a rigid connection between two links, meaning they do not move relative to each other. A `revolute` joint allows for rotational motion around a single axis.
    </details>

3.  What information is typically defined within a `<visual>` tag in URDF?
    <details>
      <summary>Answer</summary>
      The `<visual>` tag defines the visual appearance of a robot link, including its geometry (shape, size) and material properties (color, texture).
    </details>

4.  Why is a `<collision>` tag important in a URDF, even if it might be different from the `<visual>` geometry?
    <details>
      <summary>Answer</summary>
      The `<collision>` tag defines the geometry used for physics collision detection in simulations. It's often simplified compared to the visual geometry to improve simulation performance, ensuring accurate physical interactions.
    </details>

5.  What is a ROS 2 Python "package," and how is it defined?
    <details>
      <summary>Answer</summary>
      A ROS 2 Python package is a fundamental unit for organizing ROS 2 code. It's defined by a `package.xml` file (metadata, dependencies) and typically includes a `setup.py` file to configure Python-specific build and installation details (e.g., executables, Python modules).
    </details>
