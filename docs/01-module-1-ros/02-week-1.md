---
id: module-1-ros-basic-node-development
title: Basic Node Development
sidebar_label: Basic Node Development
slug: /module-1-ros/basic-node-development
---

# Module 1: ROS - Basic Node Development



This section introduces the fundamental concepts of ROS 2 development, including setting up your environment, creating packages, and writing basic nodes for communication.

## Getting Started with ROS 2

### Setting up the ROS 2 Environment
Before you can start developing with ROS 2, you need to set up your environment. This includes installing ROS 2, sourcing the setup files, and configuring your workspace.

### Understanding the ROS 2 Workspace
A ROS 2 workspace is a directory where you can create and manage your ROS 2 packages. It typically contains a `src` directory for your source code, a `build` directory for build files, an `install` directory for installed packages, and a `log` directory for log files.

## Creating Your First ROS 2 Package

### The `package.xml` file
The `package.xml` file is a manifest file that contains information about your package, such as its name, version, and dependencies.

### The `setup.py` file
The `setup.py` file is a Python script that is used to build and install your package. It specifies the package's name, version, and entry points for your nodes.

## Writing a Simple Publisher and Subscriber

### Publisher Node
A publisher node is a ROS 2 node that sends messages to a topic. This section will guide you through writing a simple publisher node in Python.

### Subscriber Node
A subscriber node is a ROS 2 node that receives messages from a topic. This section will guide you through writing a simple subscriber node in Python.

## Building and Running Your Code

### Using `colcon` to build
`colcon` is the build tool used in ROS 2. This section will show you how to use `colcon` to build your ROS 2 packages.

### Running your nodes
Once you have built your packages, you can run your nodes using the `ros2 run` command. This section will show you how to run your publisher and subscriber nodes.