---
id: module-1-ros-nodes-topics-services
title: ROS - Nodes, Topics, Services and Code Examples
sidebar_label: Nodes, Topics, Services
slug: /module-1-ros/nodes-topics-services
---

# Module 1: ROS - Nodes, Topics, Services and Code Examples

This section focuses on the practical implementation of ROS communication mechanisms: nodes, topics, and services. We will provide detailed code examples to illustrate how these components interact.

## ROS Nodes

### Definition
Understanding what a ROS node is and its role in the ROS graph.

### Creating Nodes
Step-by-step guide to writing a simple publisher and subscriber node in Python and C++.

### Node Lifecycle
How nodes are initialized, run, and terminated.

## ROS Topics

### Publishers and Subscribers
Detailed explanation of the publish-subscribe model.

### Message Types
Overview of common ROS message types and how to define custom messages.

### Code Examples
Practical examples of publishing and subscribing to data over topics.

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

### Example: Simple `rclpy` Subscriber Node

This Python script demonstrates a basic ROS 2 subscriber using `rclpy` that listens for messages on a topic and prints them.

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

**To Run These Examples:**
1.  Save the publisher script as `publisher_member_function.py` and the subscriber script as `subscriber_member_function.py` within a ROS 2 Python package (e.g., in a `nodes` directory inside your package).
2.  Ensure your ROS 2 environment is sourced.
3.  Build your ROS 2 workspace: `colcon build --packages-select <your_package_name>`
4.  Run the publisher in one terminal: `ros2 run <your_package_name> publisher_member_function`
5.  Run the subscriber in another terminal: `ros2 run <your_package_name> subscriber_member_function`

## ROS Services

### Request-Response Model
How ROS services enable synchronous communication between nodes.

### Service Definition
Defining a service request and response.

### Code Examples
Implementing a simple service server and client.



---

### Example: Simple `rclpy` Service Server Node

This Python script demonstrates a basic ROS 2 service server using `rclpy` that adds two integers.

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts # Standard service for adding integers

class MinimalServiceServer(Node):

    def __init__(self):
        super().__init__('minimal_service_server')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)
        self.get_logger().info('Service server "add_two_ints" started.')

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info('Incoming request\na: %d b: %d' % (request.a, request.b))
        return response

def main(args=None):
    rclpy.init(args=args)
    minimal_service_server = MinimalServiceServer()
    rclpy.spin(minimal_service_server)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Example: Simple `rclpy` Service Client Node

This Python script demonstrates a basic ROS 2 service client using `rclpy` to request the sum of two integers from the `add_two_ints` service.

```python
import sys
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class MinimalServiceClient(Node):

    def __init__(self):
        super().__init__('minimal_service_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        while not self.cli.wait_for_for_service(timeout_sec=1.0):
            self.get_logger().info('service not available, waiting again...')
        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        self.future = self.cli.call_async(self.req)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()

def main(args=None):
    rclpy.init(args=args)
    
    if len(sys.argv) != 3:
        MinimalServiceClient.get_logger().info('Usage: ros2 run <your_package_name> minimal_service_client A B')
        sys.exit(1)
    
    minimal_service_client = MinimalServiceClient()
    response = minimal_service_client.send_request(int(sys.argv[1]), int(sys.argv[2]))
    minimal_service_client.get_logger().info(
        'Result of add_two_ints: for %d + %d = %d' %
        (minimal_service_client.req.a, minimal_service_client.req.b, response.sum))
    minimal_service_client.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**To Run These Examples:**
1.  Save the server script as `minimal_service_server.py` and the client script as `minimal_service_client.py` within a ROS 2 Python package.
2.  Ensure your ROS 2 environment is sourced.
3.  Build your ROS 2 workspace: `colcon build --packages-select <your_package_name>`
4.  Run the service server in one terminal: `ros2 run <your_package_name> minimal_service_server`
5.  Run the service client in another terminal (providing arguments): `ros2 run <your_package_name> minimal_service_client 5 7`

---

## Practice Exercises

1.  **Service Server Implementation**: Create a ROS 2 Python service server that takes a string input (e.g., a person's name) and returns a greeting message including that name.
2.  **Service Client Implementation**: Create a corresponding ROS 2 Python service client that calls your greeting service with a name and prints the response.
3.  **Custom Service Definition**: Define a custom ROS 2 service (`robot_control/TriggerAction.srv`) with a `string action_name` request and a `bool success` response. Implement a simple server and client for it.
4.  **Error Handling in Client**: Modify your service client to handle cases where the service server is not available or returns an error.
5.  **Simulated Actuator Control**: Integrate a ROS 2 service into a simulated robot in Gazebo/Isaac Sim. For example, a service that receives a boolean and toggles an LED on the robot model.

---

## Quiz Questions

1.  What is the communication pattern of a ROS 2 `Service`?
    <details>
      <summary>Answer</summary>
      A synchronous request-response pattern, where a client sends a request and waits for a response from a service server.
    </details>

2.  What are the two main parts of a `.srv` file definition for a ROS 2 service?
    <details>
      <summary>Answer</summary>
      The request part and the response part, separated by `---`.
    </details>

3.  How do you make a ROS 2 service call from a Python client?
    <details>
      <summary>Answer</summary>
      You create a client (`self.create_client(...)`), create a request object, call `client.call_async(request)`, and then wait for the future to complete to get the result.
    </details>

4.  Why is it important for a service client to `wait_for_for_service()`?
    <details>
      <summary>Answer</summary>
      `wait_for_for_service()` ensures that the service server is active and available to receive requests before the client attempts to make a call, preventing errors due to a non-existent service.
    </details>

5.  What command is used to list all currently available ROS 2 services?
    <details>
      <summary>Answer</summary>
      `ros2 service list`.
    </details>
