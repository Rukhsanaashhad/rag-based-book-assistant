---
id: module-2-digital-twin-introduction
title: Module 2 Digital Twin - Gazebo Setup and Simulation
sidebar_label: Introduction & Gazebo
slug: /module-2-digital-twin/introduction
---

# Module 2: Digital Twin - Gazebo Setup and Simulation

This module introduces the concept of Digital Twins and how to use Gazebo, a popular robotics simulator, to create and interact with them.

## Introduction to Digital Twins

-   **What is a Digital Twin?**: A virtual representation of a physical object or system.
-   **Why use Digital Twins?**: Benefits include faster prototyping, testing in safe environments, and data analysis.

## Gazebo Setup

-   **Installation**: Installing Gazebo and integrating it with ROS.
-   **Gazebo Interface**: Navigating the Gazebo GUI, including the scene graph and properties panel.
-   **Creating a World**: Building a simple simulation environment with ground planes, walls, and basic shapes.

## Simulating a Robot

-   **Spawning a Robot**: How to load a URDF model into a Gazebo simulation.
-   **Controlling the Robot**: Sending commands to the robot using ROS topics.
-   **Sensors in Gazebo**: Adding and configuring simulated sensors like cameras and LiDAR.

### Example: Full Gazebo Launch File for Robot and World

This `launch` file will start a custom Gazebo world and then spawn a simple robot described by a URDF file, integrating ROS 2.

```xml
<?xml version="1.0"?>
<launch>
  <!-- Argument for the custom world file -->
  <arg name="world_file" default="$(find my_robot_description)/worlds/my_custom_world.world"/>

  <!-- Launch Gazebo with the custom world -->
  <include file="$(find gazebo_ros)/launch/gazebo.launch">
    <arg name="world_name" value="$(arg world_file)"/>
    <arg name="paused" value="false"/>
    <arg name="use_sim_time" value="true"/>
    <arg name="gui" value="true"/>
    <arg name="headless" value="false"/>
    <arg name="debug" value="false"/>
    <arg name="verbose" value="true"/>
  </include>

  <!-- Load the robot_description parameter from a URDF file (my_robot.urdf.xacro) -->
  <param name="robot_description" command="$(find xacro)/xacro --inorder '$(find my_robot_description)/urdf/my_robot.urdf.xacro'" />

  <!-- Spawn the robot into Gazebo -->
  <node name="urdf_spawner" pkg="gazebo_ros" type="spawn_model" respawn="false" output="screen"
        args="-urdf -model my_robot -param robot_description -x 0 -y 0 -z 0.5"/>

  <!-- Start robot_state_publisher to broadcast robot's state -->
  <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher">
    <param name="publish_frequency" type="double" value="50.0" />
  </node>

  <!-- Optional: Joint State Publisher GUI for manual control -->
  <node name="joint_state_publisher_gui" pkg="joint_state_publisher_gui" type="joint_state_publisher_gui"/>
</launch>
```

**Explanation:**
-   **`<arg name="world_file" ...>`**: Defines an argument for specifying the world file, allowing flexibility.
-   **`<include file="$(find gazebo_ros)/launch/gazebo.launch">`**: Launches the main Gazebo application.
-   **`<param name="robot_description" ...>`**: Loads the robot's URDF/XACRO definition into the ROS parameter server.
-   **`<node name="urdf_spawner" ...>`**: Spawns the robot model into the Gazebo simulation at a specified initial pose.
-   **`<node name="robot_state_publisher" ...>`**: Essential for broadcasting the robot's joint states as `tf` transformations, enabling visualization in RViz and proper operation of other ROS components.
-   **`joint_state_publisher_gui`**: (Optional) Provides a GUI to manually control robot joints for testing.

### Example: `spawn_entity_client.py` Script for Dynamic Object Spawning

This Python script acts as a ROS 2 client for Gazebo's `SpawnEntity` service, allowing you to programmatically add models to your simulation at runtime.

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from gazebo_msgs.srv import SpawnEntity
from gazebo_msgs.msg import Entity
import xml.etree.ElementTree as ET
import sys

class EntitySpawnerClient(Node):
    def __init__(self):
        super().__init__('entity_spawner_client')
        self.cli = self.create_client(SpawnEntity, '/spawn_entity')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('SpawnEntity service not available, waiting again...')
        self.get_logger().info('SpawnEntity service client created.')

    def spawn_sdf_model(self, model_name, sdf_string, x, y, z, roll=0.0, pitch=0.0, yaw=0.0):
        req = SpawnEntity.Request()
        req.name = model_name
        req.xml = sdf_string
        req.robot_namespace = model_name # Often use model name as namespace
        req.initial_pose.position.x = float(x)
        req.initial_pose.position.y = float(y)
        req.initial_pose.position.z = float(z)
        # For simplicity, convert roll, pitch, yaw to quaternion (assuming static object)
        q = self.euler_to_quaternion(roll, pitch, yaw)
        req.initial_pose.orientation.x = q[0]
        req.initial_pose.orientation.y = q[1]
        req.initial_pose.orientation.z = q[2]
        req.initial_pose.orientation.w = q[3]

        self.get_logger().info(f"Spawning model '{model_name}' at [{x}, {y}, {z}]...")
        self.future = self.cli.call_async(req)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()

    def euler_to_quaternion(self, r, p, y):
        # Yaw is often around Z axis for objects
        cy = np.cos(y * 0.5); sy = np.sin(y * 0.5);
        cp = np.cos(p * 0.5); sp = np.sin(p * 0.5);
        cr = np.cos(r * 0.5); sr = np.sin(r * 0.5);
        qw = cr * cp * cy + sr * sp * sy;
        qx = sr * cp * cy - cr * sp * sy;
        qy = cr * sp * cy + sr * cp * sy;
        qz = cr * cp * sy - sr * sp * cy;
        return [qx, qy, qz, qw]


def main(args=None):
    rclpy.init(args=args)
    client = EntitySpawnerClient()

    # --- Example: Spawn a simple Box ---
    box_sdf = """<?xml version="1.0" ?>
<sdf version="1.6">
  <model name="my_box">
    <pose>0 0 0 0 0 0</pose>
    <static>false</static>
    <link name="link">
      <inertial>
        <mass>1.0</mass>
        <inertia>
          <ixx>0.001</ixx>
          <ixy>0</ixy>
          <ixz>0</ixz>
          <iyy>0.001</iyy>
          <iyz>0</iyz>
          <izz>0.001</izz>
        </inertia>
      </inertial>
      <collision name="collision">
        <geometry><box><size>0.1 0.1 0.1</size></box></geometry>
      </collision>
      <visual name="visual">
        <geometry><box><size>0.1 0.1 0.1</size></box></geometry>
        <material><script><uri>file://media/materials/scripts/gazebo.material</uri><name>Gazebo/Green</name></script></material>
      </visual>
    </link>
  </model>
</sdf>"""
    
    response = client.spawn_sdf_model("dynamic_box", box_sdf, 0.5, 0.5, 1.0)
    if response.success:
        client.get_logger().info(f"Successfully spawned dynamic_box: {response.status_message}")
    else:
        client.get_logger().error(f"Failed to spawn dynamic_box: {response.status_message}")

    # --- Example: Spawn a simple Cylinder ---
    cylinder_sdf = """<?xml version="1.0" ?>
<sdf version="1.6">
  <model name="my_cylinder">
    <pose>0 0 0 0 0 0</pose>
    <static>false</static>
    <link name="link">
      <inertial>
        <mass>0.5</mass>
        <inertia>
          <ixx>0.0005</ixx>
          <ixy>0</ixy>
          <ixz>0</ixz>
          <iyy>0.0005</iyy>
          <iyz>0</iyz>
          <izz>0.0005</izz>
        </inertia>
      </inertial>
      <collision name="collision">
        <geometry><cylinder><radius>0.05</radius><length>0.2</length></cylinder></geometry>
      </collision>
      <visual name="visual">
        <geometry><cylinder><radius>0.05</radius><length>0.2</length></cylinder></geometry>
        <material><script><uri>file://media/materials/scripts/gazebo.material</uri><name>Gazebo/Blue</name></script></material>
      </visual>
    </link>
  </model>
</sdf>"""
    response = client.spawn_sdf_model("dynamic_cylinder", cylinder_sdf, -0.5, -0.5, 1.5, roll=0.0, pitch=np.pi/4, yaw=0.0)
    if response.success:
        client.get_logger().info(f"Successfully spawned dynamic_cylinder: {response.status_message}")
    else:
        client.get_logger().error(f"Failed to spawn dynamic_cylinder: {response.status_message}")


    client.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Explanation:**
-   **`EntitySpawnerClient`**: A ROS 2 node that creates a client for the `/spawn_entity` service provided by Gazebo.
-   **`spawn_sdf_model`**: A method to send a request to Gazebo to spawn a model defined by an SDF string at a specified pose.
-   **`main` function**: Demonstrates spawning two different primitive shapes (box, cylinder) using their SDF definitions.
-   **`euler_to_quaternion`**: A utility function to convert Euler angles to quaternions, necessary for setting model orientation.

### Example: Custom Gazebo World File Snippet (`my_custom_world.world`)

This XML snippet defines a more complex Gazebo world with a ground plane, lights, and some static objects like walls and a table.

```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <world name="my_custom_world">
    <!-- A global light source -->
    <include>
      <uri>model://sun</uri>
    </include>
    <!-- A ground plane -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <!-- Simple Wall 1 -->
    <model name="wall_1">
      <static>true</static>
      <pose>2 0 0.5 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry><box><size>0.1 5 1</size></box></geometry>
        </collision>
        <visual name="visual">
          <geometry><box><size>0.1 5 1</size></box></geometry>
          <material><script><uri>file://media/materials/scripts/gazebo.material</uri><name>Gazebo/Grey</name></script></material>
        </visual>
      </link>
    </model>

    <!-- Simple Wall 2 -->
    <model name="wall_2">
      <static>true</static>
      <pose>0 2 0.5 0 0 1.5707</pose>
      <link name="link">
        <collision name="collision">
          <geometry><box><size>0.1 5 1</size></box></geometry>
        </collision>
        <visual name="visual">
          <geometry><box><size>0.1 5 1</size></box></geometry>
          <material><script><uri>file://media/materials/scripts/gazebo.material</uri><name>Gazebo/Grey</name></script></material>
        </visual>
      </link>
    </model>

    <!-- Simple Table -->
    <include>
      <uri>model://table</uri>
      <pose>1 1 0 0 0 0</pose>
    </include>

    <!-- Additional models and environments can be added here -->

  </world>
</sdf>
```

**Explanation:**
-   Defines a world named `my_custom_world`.
-   Includes default `sun` and `ground_plane` models.
-   Adds two static `wall` models using `<model>` tags with `<static>true</static>`.
-   Includes a pre-existing `table` model from Gazebo's model database using `<include><uri>`.

### Example: Gazebo IMU Sensor Plugin in URDF with Noise Parameters



## Practice Exercises

1.  **Custom SDF World Creation**: Create a new `.world` file for Gazebo that includes at least a ground plane, a light source, and three distinct static models (e.g., a simple wall, a box, and a cylinder) placed at specific coordinates.
2.  **Dynamic Object Spawning with Python**: Write a Python script using the Gazebo `SpawnEntity` service to dynamically spawn an object (e.g., a simple cube or sphere) into a running Gazebo simulation at a random location within a predefined area.
3.  **Sensor Noise Tuning**: Modify the IMU sensor plugin in a URDF file to experiment with different `stddev` (standard deviation) values for `angular_velocity` and `linear_acceleration` noise. Observe how these changes affect the perceived sensor data in ROS 2.
4.  **Gazebo Plugin for ROS Integration**: Develop a conceptual plan for a custom Gazebo plugin (C++ or Python) that reads a specific Gazebo model's state (e.g., position) and publishes it as a custom ROS 2 message.
5.  **Building an Obstacle Environment**: Design a Gazebo world file that creates a simple maze or an environment with scattered obstacles (boxes, pillars) to challenge a mobile robot's navigation capabilities.

---

## Quiz Questions

1.  What is the main conceptual difference between URDF and SDF file formats in Gazebo?
    <details>
      <summary>Answer</summary>
      URDF (Unified Robot Description Format) is primarily for describing a robot's kinematic and dynamic properties, and its visual appearance. SDF (Simulation Description Format) is more comprehensive, capable of describing the entire simulation environment, including terrains, lights, static objects, and multiple robots.
    </details>

2.  What is the primary purpose of Gazebo plugins?
    <details>
      <summary>Answer</summary>
      Gazebo plugins extend the functionality of the simulator, allowing users to customize physics, add new sensor types, implement custom control logic, and crucially, bridge Gazebo's simulation data and control inputs with external frameworks like ROS 2.
    </details>

3.  Name two common sources of discrepancy contributing to the "sim-to-real" gap in robotics.
    <details>
      <summary>Answer</summary>
      Differences in sensor noise characteristics, inaccurate physics models (friction, restitution), unmodeled environmental factors (air currents, lighting variations), communication latency, and calibration errors between real and simulated hardware.
    </details>

4.  How can you typically control the data publishing rate of a simulated sensor (e.g., camera, LiDAR) in Gazebo?
    <details>
      <summary>Answer</summary>
      The data publishing rate of a simulated sensor is typically controlled by the `<update_rate>` tag within the `<sensor>` block in the URDF's `<gazebo>` extension or directly within the SDF definition.
    </details>

5.  What is the role of the `<inertial>` tag within a URDF or SDF `<link>` element?
    <details>
      <summary>Answer</summary>
      The `<inertial>` tag defines the inertial properties of a robot's link, including its mass, center of mass (origin), and inertia matrix. These parameters are crucial for accurate physics simulation, affecting how the link responds to forces and torques.
    </details>