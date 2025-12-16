---
id: module-1-ros-basic-node-development
title: Basic Node Development
sidebar_label: Basic Node Development
slug: /module-1-ros/basic-node-development
---

# Module 1: ROS - Basic Node Development



---

## Practice Exercises

1.  **Publisher Node Implementation**: Write a Python ROS 2 node that publishes a simple `std_msgs/Int32` message to a topic named `/counter` every 0.5 seconds, incrementing the integer value.
2.  **Subscriber Node Implementation**: Write a Python ROS 2 node that subscribes to the `/counter` topic and prints the received integer values to the console.
3.  **Package.xml Customization**: Add a new maintainer with an email address, and a new build dependency to the `package.xml` of a ROS 2 package.
4.  **`setup.py` Entry Point**: Configure the `setup.py` of a ROS 2 Python package to create a new console script entry point for a Python node you've written.
5.  **Environment Variables**: Explain the purpose of `ROS_DOMAIN_ID` and `ROS_LOCALHOST_ONLY` environment variables in ROS 2. Set `ROS_DOMAIN_ID` to a custom value and verify its effect.

---

## Quiz Questions

1.  What is the primary role of a "topic" in ROS 2?
    <details>
      <summary>Answer</summary>
      A topic serves as a channel for asynchronous, many-to-many communication between ROS 2 nodes, allowing publishers to send messages and subscribers to receive them.
    </details>

2.  Which file in a ROS 2 Python package specifies its executable scripts?
    <details>
      <summary>Answer</summary>
      `setup.py` (specifically, via the `entry_points` argument in `setup()`).
    </details>

3.  How does `colcon build` know what dependencies a ROS 2 package needs?
    <details>
      <summary>Answer</summary>
      `colcon build` reads the `package.xml` file to identify build and run dependencies for the package.
    </details>

4.  What is the significance of the QoS setting `history_depth` for a publisher or subscriber?
    <details>
      <summary>Answer</summary>
      `history_depth` specifies how many samples (messages) are kept in the publisher's or subscriber's queue, influencing how late-joining subscribers or unreliable networks are handled.
    </details>

5.  What is a "Node" in ROS 2?
    <details>
      <summary>Answer</summary>
      A Node is an individual process or executable unit within the ROS 2 computational graph, responsible for performing a specific task.
    </details>