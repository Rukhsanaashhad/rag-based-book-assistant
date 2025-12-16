---
id: appendices-troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
slug: /appendices/troubleshooting
---

# Appendices: Troubleshooting



---

<h2>Practice Exercises</h2>

1.  **ROS 2 Network Debugging**: You are attempting to run a ROS 2 node on a remote Jetson, but it cannot see topics published by your workstation. Outline a systematic debugging process, including commands to check network configuration, ROS 2 environment variables, and firewalls.
2.  **URDF Loading Failure**: Your robot model is failing to load correctly in RViz 2, showing a red error. List the common causes for URDF loading failures and the steps you would take to diagnose and fix the issue.
3.  **Sensor Data Anomaly**: A simulated LiDAR sensor in Gazebo is publishing data, but it appears to be incorrect (e.g., all zeros, constant values). Describe a debugging approach, including checking sensor configuration, Gazebo plugins, and ROS 2 topic data.
4.  **Performance Bottleneck Identification**: Your robot's navigation stack is running slowly, causing jerky movements. How would you systematically identify the performance bottleneck (CPU, GPU, network, specific ROS node) in a ROS 2 system?
5.  **Sim-to-Real Discrepancy Analysis**: After deploying an object detection model trained in Isaac Sim to a real robot, you notice a significant drop in accuracy. Detail a process for analyzing this "sim-to-real" gap, including checking sensor calibration, lighting conditions, and potential model biases.

---

<h2>Quiz Questions</h2>

1.  What is the first step you should take when a ROS 2 node fails to start or crashes immediately?
    <details>
      <summary>Answer</summary>
      Check the node's console output for error messages and review the ROS 2 log files (usually in `~/.ros/log/`) for detailed backtraces or error specifics.
    </details>

2.  How can `ros2 graph` be a useful tool for troubleshooting in ROS 2?
    <details>
      <summary>Answer</summary>
      `ros2 graph` visualizes the connections between nodes and topics in real-time, helping to identify if nodes are running, topics are being published/subscribed to as expected, and if there are any unexpected disconnections or orphaned nodes.
    </details>

3.  What command allows you to inspect the contents of a ROS 2 topic in real-time?
    <details>
      <summary>Answer</summary>
      `ros2 topic echo <topic_name>`.
    </details>

4.  If a `tf` (Transform) frame is missing in your robot setup, what are the common causes and how would you verify it?
    <details>
      <summary>Answer</summary>
      Common causes include `robot_state_publisher` not running, incorrect `frame_id`s in messages, or missing `static_transform_publisher`s. You can verify this using `ros2 run tf2_tools view_frames` to generate a TF tree diagram or `ros2 run tf2_ros tf2_monitor`.
    </details>

5.  Describe the purpose of using a `ros2 launch` file for troubleshooting complex robot systems.
    <details>
      <summary>Answer</summary>
      `ros2 launch` files provide a structured way to start multiple nodes and configure their parameters consistently. When troubleshooting, you can easily modify parameters, add debug flags, or launch individual components to isolate problems in a complex system.
    </details>
