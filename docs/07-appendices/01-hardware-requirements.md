---
id: appendices-hardware-requirements
title: Appendices - Hardware Requirements and Jetson Kit
sidebar_label: Hardware & Jetson Kit
slug: /appendices/hardware-requirements
---

# Appendices: Hardware Requirements and Jetson Kit

This section provides details on the recommended hardware for undertaking the projects and exercises in this book, with a specific focus on the NVIDIA Jetson development kits.

## Development Workstation

### Operating System
-   **Recommended:** Ubuntu 20.04 LTS or newer.
-   **Alternative:** Windows 10/11 with WSL2 (Windows Subsystem for Linux 2) and Ubuntu 20.04.

### CPU, RAM, and Storage
-   **CPU:** Intel Core i7 / AMD Ryzen 7 or better.
-   **RAM:** 32 GB DDR4 or more.
-   **Storage:** 1 TB NVMe SSD or better.

### Graphics Card (GPU)
-   **NVIDIA GPU:** A dedicated NVIDIA GPU is essential for running Isaac Sim and other GPU-accelerated robotics applications.
-   **Recommended:** NVIDIA GeForce RTX 3060 / 4060 or better.

## NVIDIA Jetson Developer Kits

### Jetson Orin Nano
-   An entry-level developer kit for learning and prototyping.
-   Suitable for basic AI and computer vision tasks.

### Jetson Xavier NX
-   A mid-range developer kit that offers a significant performance boost over the Nano.
-   Ideal for more demanding AI and computer vision applications.

### Jetson AGX Orin
-   The most powerful Jetson developer kit available.
-   Designed for high-performance robotics and autonomous machines.

## Robotics Hardware

### Mobile Robot Platforms
-   A mobile robot platform, such as a TurtleBot or a custom-built robot, is recommended for the projects in this book.

### Humanoid Robots
-   For the advanced modules and capstone project, a humanoid robot is recommended.

## Sensors and Peripherals

### Cameras and LiDAR
-   A stereo camera, such as the Intel RealSense D435i, is recommended for 3D perception.
-   A 2D or 3D LiDAR sensor is also recommended for mapping and localization.

### IMUs and other sensors
-   An Inertial Measurement Unit (IMU) is essential for estimating the robot's orientation.
-   Other sensors, such as encoders and force-torque sensors, may also be useful.





---

<h2>Practice Exercises</h2>

1.  **Jetson Model Selection**: You need to select a Jetson developer kit for a project that involves real-time object detection from multiple high-resolution cameras on a mobile robot. Which Jetson model would you choose and why? Justify your choice based on its specifications.
2.  **Development Environment Setup Comparison**: Compare and contrast setting up a robotics development environment on a native Ubuntu installation versus using WSL2 on Windows. Discuss advantages and disadvantages of each for this course's content.
3.  **GPU Utilization in Robotics**: Identify three distinct tasks in robotics (e.g., SLAM, path planning, deep learning inference) that significantly benefit from GPU acceleration. Briefly explain *how* the GPU contributes to performance in each case.
4.  **Edge AI vs. Cloud AI in Robotics**: Discuss the trade-offs between performing AI computations on an edge device (like a Jetson) versus offloading them to cloud-based services for a robotics application. Consider latency, cost, and connectivity.
5.  **Custom Robotics Platform Integration**: Imagine you have a custom-built mobile robot chassis. Outline the steps required to integrate a Jetson developer kit as its brain, including power management, sensor interfacing, and communication with motor controllers.

---

<h2>Quiz Questions</h2>

1.  What is the primary advantage of NVIDIA Jetson developer kits for edge AI robotics?
    <details>
      <summary>Answer</summary>
      They provide powerful, energy-efficient GPU-accelerated computing capabilities in a compact form factor, ideal for deploying AI models and complex robotics algorithms directly on autonomous machines.
    </details>

2.  Which NVIDIA Jetson series is generally recommended for entry-level robotics projects due to its accessibility and balance of performance for basic AI tasks?
    <details>
      <summary>Answer</summary>
      Jetson Nano.
    </details>

3.  Why is sufficient RAM and fast storage (SSD/NVMe) crucial for a robotics development PC?
    <details>
      <summary>Answer</summary>
      Sufficient RAM is needed for running multiple simulations, large datasets, and IDEs concurrently. Fast storage accelerates OS boot times, application loading, and compilation processes, all critical for an efficient development workflow.
    </details>

4.  What is the main benefit of using Ubuntu as the recommended operating system for robotics development?
    <details>
      <summary>Answer</summary>
      Ubuntu is the de facto standard for ROS development, offering excellent compatibility, extensive community support, a rich ecosystem of tools and libraries, and robust performance for robotics applications.
    </details>

5.  What kind of tasks would typically necessitate upgrading from a Jetson Xavier NX to a Jetson AGX Orin for a robotics project?
    <details>
      <summary>Answer</summary>
      Tasks requiring significantly higher AI inference throughput, more complex multi-sensor fusion, advanced real-time control, or running larger, more sophisticated neural networks would benefit from the greater computational power of the Jetson AGX Orin.
    </details>
