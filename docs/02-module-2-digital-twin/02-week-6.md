---
id: module-2-digital-twin-unity-visualization
title: Module 2 Digital Twin - Unity Visualization
sidebar_label: Unity Visualization
slug: /module-2-digital-twin/unity-visualization
---

# Module 2: Digital Twin - Unity Visualization

This section explores how to use the Unity game engine for high-fidelity visualization of our digital twins. Unity offers advanced graphics capabilities that can provide a more immersive and realistic simulation experience compared to other tools.

## Why Unity for Robotics?

### High-Fidelity Graphics
Creating photorealistic environments and robot models.

### Cross-Platform Support
Deploying visualizations on various platforms, including VR and AR.

### Rich Asset Store
Access to a vast library of pre-built assets to accelerate development.

## Unity and ROS Integration

### Unity Robotics Hub
An open-source toolkit for integrating Unity with ROS.

### ROS-TCP-Connector
The underlying communication protocol for connecting Unity to a ROS network.

### Setting up a Project
A step-by-step guide to creating a Unity project and connecting it to ROS.

## Visualizing a Robot in Unity

### Importing a URDF
How to import a robot model into Unity.

### Controlling the Robot
Sending ROS messages from Unity to control the robot's joints.

### Visualizing Sensor Data
Displaying camera feeds and LiDAR scans in the Unity environment.

### Example: ROS-TCP-Connector Setup in Unity

This C# script snippet demonstrates how to set up a basic ROS-TCP-Connector to subscribe to a `Float32` topic.

```csharp
using UnityEngine;
using Unity.Robotics.ROSTCPConnector;
using RosMessageTypes.Std; // Example: using standard Float32 message type

public class RosSubscriberExample : MonoBehaviour
{
    ROSConnection ros;
    public string topicName = "my_float_topic";

    void Start()
    {
        ros = ROSConnection.GetOrCreateInstance(); // Corrected Get  Instance to GetOrCreateInstance
        ros.Subscribe<Float32Msg>(topicName, ReceiveMessage);
    }

    void ReceiveMessage(Float32Msg message)
    {
        Debug.Log("Received ROS Message: " + message.data);
        // Process the received data, e.g., update a UI element or control a robot joint
    }
}
```

**Explanation:**
1.  **`ROSConnection.GetOrCreateInstance()`**: Correctly gets or creates the singleton instance of the ROS Connection.
2.  **`ros.Subscribe<Float32Msg>(topicName, ReceiveMessage)`**: Subscribes to the specified ROS topic (`my_float_topic`) with the message type `Float32Msg`. When a message is received, the `ReceiveMessage` method is called.
3.  **`ReceiveMessage(Float32Msg message)`**: This callback function receives the ROS message. You can access the data (e.g., `message.data`) and use it to control objects or update visualizations in your Unity scene.

### Example: Publishing a Joint Command from Unity to ROS

This C# script snippet shows how to publish a joint command from Unity to a ROS topic.

```csharp
using UnityEngine;
using Unity.Robotics.ROSTCPConnector;
using RosMessageTypes.Std; // Example: using standard Float32 message type

public class RosPublisherExample : MonoBehaviour
{
    ROSConnection ros;
    public string topicName = "joint_command_topic";
    public float jointValue = 0.0f;

    void Start()
    {
        ros = ROSConnection.GetOrCreateInstance(); // Corrected Get  Instance to GetOrCreateInstance
        // Register publisher
        ros.RegisterPublisher<Float32Msg>(topicName);
    }

    void Update()
    {
        // Example: Publish joint command on key press
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Float32Msg jointCmd = new Float32Msg(jointValue);
            ros.Publish(topicName, jointCmd);
            Debug.Log("Published joint command: " + jointValue);
        }
    }
}
```

**Explanation:**
1.  **`ros.RegisterPublisher<Float32Msg>(topicName)`**: Registers a publisher for the specified topic and message type.
2.  **`Float32Msg jointCmd = new Float32Msg(jointValue)`**: Creates a new ROS message with the desired joint value.
3.  **`ros.Publish(topicName, jointCmd)`**: Publishes the message to the ROS topic.

**Setup in Unity:**
1.  Install the `ROS TCP Connector` package from the Unity Robotics Hub.
2.  Add a `ROSConnection` component to an empty GameObject in your scene and configure its `Ros IP Address` and `Ros Port`.
3.  Attach these scripts to suitable GameObjects in your scene.



---

## Practice Exercises

1.  **Unity Project Setup & ROS Connection**: Set up a new Unity 3D project. Install `Unity Robotics Hub` and `ROS-TCP-Connector`. Configure the `ROSConnection` component and verify a successful connection to an active ROS 2 environment.
2.  **URDF Robot Model Import & Display**: Import a simple mobile robot URDF model (e.g., a differential drive robot) into your Unity project. Ensure its visual representation is correct and all joints are properly recognized within Unity.
3.  **Unity to ROS Control Interface**: Create a C# script in Unity. Implement logic to read user input (e.g., WASD keys) and publish `geometry_msgs/Twist` messages to a ROS 2 topic (`/cmd_vel`) to control the imported robot model.
4.  **ROS Sensor Data Visualization in Unity**: Develop a C# script that subscribes to a ROS 2 `sensor_msgs/LaserScan` topic. Visualize the incoming LiDAR data in the Unity scene (e.g., by drawing lines or placing small spheres at detected points).
5.  **Simulated Camera Stream to Unity Texture**: Set up a ROS 2 node that publishes `sensor_msgs/Image` messages (e.g., from a simulated camera in Gazebo). Create a Unity subscriber that receives this image stream and displays it dynamically on a UI Raw Image or a 3D plane in the Unity scene.

---

## Quiz Questions

1.  What is the primary advantage of utilizing Unity for robotic simulation visualization over simpler tools like RViz?
    <details>
      <summary>Answer</summary>
      Unity offers superior photorealistic rendering, advanced lighting, rich environments, and a comprehensive asset store, enabling highly immersive and visually appealing simulations critical for human-robot interaction studies and compelling demonstrations.
    </details>

2.  What is the role of the `ROSConnection.GetOrCreateInstance()` method within Unity C# scripts?
    <details>
      <summary>Answer</summary>
      `GetOrCreateInstance()` is used to access the singleton instance of the `ROSConnection` manager. This manager handles the underlying TCP communication setup and facilitates the registration of ROS publishers and subscribers within the Unity application.
    </details>

3.  How are `URDF` robot models typically integrated into a Unity project, and what Unity package is commonly used for this?
    <details>
      <summary>Answer</summary>
      URDF robot models are imported into Unity via the `Unity Robotics URDF Importer` package. This package parses the URDF XML and generates a corresponding Unity prefab with physics components and joint structures.
    </details>

4.  Which Unity Robotics package is responsible for establishing the communication bridge between Unity and a ROS network?
    <details>
      <summary>Answer</summary>
      The `ROS-TCP-Connector` package is the core component that enables TCP-based message exchange between Unity and the ROS ecosystem.
    </details>

5.  If you want to send a continuous stream of joint angle commands from Unity to a ROS 2 robot, which ROS 2 communication primitive would be most appropriate to implement in Unity?
    <details>
      <summary>Answer</summary>
      A ROS 2 Topic is most appropriate for sending continuous streams of data like joint angle commands from Unity to a ROS 2 robot, using a publisher in Unity and a subscriber on the robot side.
    </details>