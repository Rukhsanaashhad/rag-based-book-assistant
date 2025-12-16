---
id: module-1-ros-deep-dive
title: ROS 2 Architecture Deep Dive
sidebar_label: ROS 2 Architecture Deep Dive
slug: /module-1-ros/deep-dive
---

# Module 1: ROS - ROS 2 Architecture Deep Dive

This section continues our exploration of the ROS 2 architecture, focusing on the practical implications of its design.

## ROS 2 Nodes and Topics

-   **Creating ROS 2 Nodes**: Writing a simple "Hello World" node in Python and C++.
-   **Publishers and Subscribers**: Implementing communication between nodes using topics.
-   **ROS 2 Launch Files**: Managing multiple nodes with launch files.

## ROS 2 Services and Actions

-   **Services**: Implementing request-response communication between nodes.
-   **Actions**: For long-running tasks that provide feedback and can be preempted.
-   **Comparison with ROS 1**: Understanding the differences in implementation.



---

### Example: Simple `rclpy` Subscriber Node

This Python script demonstrates a basic ROS 2 subscriber using `rclpy` that listens for "Hello ROS 2" messages on a topic and prints them.

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalSubscriber(Node):

    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)

def main(args=None):
    rclpy.init(args=args)

    minimal_subscriber = MinimalSubscriber()

    rclpy.spin(minimal_subscriber)

    # Destroy the node explicitly
    minimal_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**To Run This Example:**
1.  Save the script as `subscriber_member_function.py` within a ROS 2 Python package.
2.  Ensure your ROS 2 environment is sourced.
3.  Build your ROS 2 workspace: `colcon build --packages-select <your_package_name>`
4.  Run: `ros2 run <your_package_name> subscriber_member_function`
5.  In a separate terminal, run the publisher from the previous example (or a compatible one): `ros2 run <your_package_name> publisher_member_function`

---

## Practice Exercises

1.  **Basic Node Creation**: Write a simple ROS 2 Python node that logs a message to the console upon startup and then periodically (e.g., every 2 seconds) logs another message.
2.  **Topic Echo and Info**: Launch a ROS 2 node that publishes a standard message type (e.g., `std_msgs/String`). Use `ros2 topic echo` and `ros2 topic info` to inspect the topic's data and details.
3.  **Launch File with Parameters**: Create a ROS 2 Python launch file that starts a node and passes a parameter to it (e.g., a string or integer parameter).
4.  **Service Request**: Write a ROS 2 Python client node that makes a request to a simple ROS 2 service (e.g., `AddTwoInts`) and prints the response.
5.  **Action Goal Sending**: Implement a ROS 2 Python client node that sends a goal to a ROS 2 action server (e.g., `Fibonacci`) and prints whether the goal was accepted or rejected.

---

## Quiz Questions

1.  What is the purpose of `rclpy.spin(node)` in a ROS 2 Python node?
    <details>
      <summary>Answer</summary>
      `rclpy.spin(node)` keeps the node alive and allows its callbacks (e.g., from subscribers, service servers, timers) to be processed. It blocks until the node is shut down.
    </details>

2.  How do you include other launch files within a ROS 2 Python launch file?
    <details>
      <summary>Answer</summary>
      Using `IncludeLaunchDescription` from `launch.actions` and `PythonLaunchDescriptionSource` (or `XMLLaunchDescriptionSource`).
    </details>

3.  What is the difference between a `Service` and an `Action` in ROS 2?
    <details>
      <summary>Answer</summary>
      A `Service` is a synchronous request-response mechanism for short, blocking operations. An `Action` is an asynchronous, long-running task that provides feedback on its progress and can be preempted.
    </details>

4.  Which ROS 2 message type would you use for simple text messages?
    <details>
      <summary>Answer</summary>
      `std_msgs/String`.
    </details>

5.  What command is used to see a list of all available ROS 2 packages in your environment?
    <details>
      <summary>Answer</summary>
      `ros2 pkg list`.
    </details>