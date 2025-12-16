---
id: module-1-ros-architecture
title: ROS/ROS 2 Architecture
sidebar_label: ROS Architecture
slug: /module-1-ros/architecture
---

# Module 1: ROS - ROS/ROS 2 Architecture

This section begins our deep dive into the architecture of ROS and its successor, ROS 2. Understanding the architecture is crucial for designing and debugging complex robotic systems.

## ROS 1 Architecture

-   **Master-Node-Slave Architecture**: The role of the ROS Master in facilitating communication between nodes.
-   **XML-RPC based communication**: How nodes register with the master and look up other nodes.
-   **Parameter Server**: A shared dictionary for configuration parameters.

## ROS 2 Architecture

-   **Decentralized Discovery**: The shift from a centralized master to a decentralized discovery mechanism using DDS (Data Distribution Service).
-   **Quality of Service (QoS)**: Fine-tuning communication reliability and durability.
-   **Improved Security**: The introduction of authentication and encryption.



---

### Example: Simple `rclpy` Publisher Node

This Python script demonstrates a basic ROS 2 publisher using `rclpy` that periodically publishes "Hello ROS 2" messages to a topic.

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello ROS 2: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)

    minimal_publisher = MinimalPublisher()

    rclpy.spin(minimal_publisher)

    # Destroy the node explicitly
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**To Run This Example:**
1.  Save the script as `publisher_member_function.py` within a ROS 2 Python package.
2.  Ensure your ROS 2 environment is sourced.
3.  Build your ROS 2 workspace: `colcon build --packages-select <your_package_name>`
4.  Run: `ros2 run <your_package_name> publisher_member_function`

---

## Practice Exercises

1.  **ROS 1 vs. ROS 2 Comparison**: Create a table comparing ROS 1 and ROS 2 across key architectural aspects such as communication middleware, node discovery, security, and real-time capabilities.
2.  **DDS Vendors**: Research different DDS (Data Distribution Service) vendors or implementations available and discuss how they might impact ROS 2 system performance or features.
3.  **QoS Policy Impact**: Describe a scenario in robotics where choosing the wrong QoS (Quality of Service) policy (e.g., `Best Effort` instead of `Reliable`) could lead to critical system failures.
4.  **SROS 2 Implementation**: Outline the conceptual steps to enable and configure SROS 2 (Secure ROS 2) for a simple publisher-subscriber pair, focusing on key security artifacts needed.
5.  **Micro-ROS**: Research Micro-ROS and explain how it extends ROS 2's capabilities to resource-constrained embedded systems, highlighting its architectural differences for microcontrollers.

---

## Quiz Questions

1.  What is the primary communication mechanism used by ROS 2?
    <details>
      <summary>Answer</summary>
      DDS (Data Distribution Service).
    </details>

2.  How does ROS 2 achieve decentralized discovery?
    <details>
      <summary>Answer</summary>
      ROS 2 uses DDS, which allows nodes to discover each other directly on the network without a central master, improving scalability and fault tolerance.
    </details>

3.  What are QoS policies in ROS 2 primarily used for?
    <details>
      <summary>Answer</summary>
      QoS (Quality of Service) policies are used to define the characteristics of communication between nodes, such as reliability, durability, and history, allowing developers to fine-tune communication for specific application needs.
    </details>

4.  Name one security feature provided by SROS 2.
    <details>
      <summary>Answer</summary>
      Authentication, encryption, access control.
    </details>

5.  What is a "Parameter Server" in ROS 1?
    <details>
      <summary>Answer</summary>
      A Parameter Server in ROS 1 is a shared dictionary that allows nodes to store and retrieve parameters at runtime, often used for configuration settings.
    </details>
