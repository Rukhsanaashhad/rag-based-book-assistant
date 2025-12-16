const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      link: {
        type: 'doc',
        id: 'introduction/00-introduction',
      },
      items: [
        'introduction/why-physical-ai-matters',
        'introduction/from-digital-ai-to-embodied-intelligence',
        'introduction/current-humanoid-landscape',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2',
      link: {
        type: 'doc',
        id: 'module-1-ros/01-module-1-ros',
      },
      items: [
        'module-1-ros/module-1-ros-introduction',
        'module-1-ros/module-1-ros-basic-node-development',
        'module-1-ros/module-1-ros-architecture',
        'module-1-ros/module-1-ros-deep-dive',
        'module-1-ros/module-1-ros-nodes-topics-services',
        'module-1-ros/module-1-ros-urdf-python-packages',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin & Gazebo',
      link: {
        type: 'doc',
        id: 'module-2-digital-twin/02-module-2-digital-twin',
      },
      items: [
        'module-2-digital-twin/module-2-digital-twin-introduction',
        'module-2-digital-twin/module-2-digital-twin-unity-visualization',
        'module-2-digital-twin/module-2-digital-twin-advanced-simulation',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac',
      link: {
        type: 'doc',
        id: 'module-3-nvidia-isaac/03-module-3-nvidia-isaac',
      },
      items: [
        'module-3-nvidia-isaac/module-3-nvidia-isaac-introduction',
        'module-3-nvidia-isaac/module-3-nvidia-isaac-isaac-ros-perception',
        'module-3-nvidia-isaac/module-3-nvidia-isaac-advanced-simulation',
        'module-3-nvidia-isaac/module-3-nvidia-isaac-advanced-operations',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      link: {
        type: 'doc',
        id: 'module-4-vla-humanoid/04-module-4-vla-humanoid',
      },
      items: [
        'module-4-vla-humanoid/module-4-vla-humanoid-introduction',
        'module-4-vla-humanoid/module-4-vla-humanoid-vla-models',
        'module-4-vla-humanoid/module-4-vla-humanoid-training-deploying-vla-models',
        'module-4-vla-humanoid/module-4-vla-humanoid-conversational-robotics',
      ],
    },
    {
      type: 'category',
      label: 'Capstone Project',
      link: {
        type: 'doc',
        id: 'capstone-project/05-capstone-project',
      },
      items: [
        'capstone-project/capstone-project-autonomous-humanoid',
      ],
    },
    {
      type: 'category',
      label: 'Assessments',
      link: {
        type: 'doc',
        id: 'assessments/06-assessments',
      },
      items: [
        'assessments/assessments-grading-rubrics',
      ],
    },
    {
      type: 'category',
      label: 'Appendices',
      link: {
        type: 'doc',
        id: 'appendices/07-appendices',
      },
      items: [
        'appendices/appendices-hardware-requirements',
        'appendices/appendices-lab-setups',
        'appendices/appendices-jetson-student-kit',
        'appendices/appendices-troubleshooting',
        'appendices/appendices-further-reading',
      ],
    },
  ],
};

export default sidebars;