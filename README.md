# AI-Powered Resume Analyzer & Skill Matcher

This project is a serverless, scalable platform designed to help users analyze their resumes, identify skill gaps, and receive personalized career recommendations. It leverages cloud-native technologies for seamless data processing and interaction.

## 🚀 Features

- Upload your resume and extract structured data (skills, experience, education).
- Match your resume against job descriptions or skill benchmarks.
- Receive insights and personalized skill development paths.
- Responsive web interface built with Next.js.
- Cloud-based, serverless backend for high scalability and low operational overhead.

## 🏗️ Architecture Overview

Our platform is built using modern serverless and scalable architecture principles:

### 📁 Storage
- **AWS S3**: Secure storage of uploaded resumes and job datasets.

### ⚙️ Processing
- **AWS Lambda**: Stateless backend functions for resume parsing and skill extraction.
- **API Gateway**: Exposes Lambda functions as secure RESTful endpoints.

### 🧠 Data Layer
- **MongoDB Atlas**: Stores structured resume data, user profiles, skill gap results, and job requirements.

### 🧩 Backend
- **Flask API**: Handles user interactions, resume analysis requests, and bridges frontend with cloud services.

### 💻 Frontend
- **Next.js (React)**: Responsive, intuitive interface for uploading resumes, inputting skills, and viewing recommendations.

## 📦 Tech Stack

- **Frontend**: Next.js (React), HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Cloud Services**: AWS S3, AWS Lambda, API Gateway, MongoDB Atlas

## Architecture Diagram

![WhatsApp Image 2025-04-27 at 21 43 44_ef219e11](https://github.com/user-attachments/assets/0509eec5-0e52-4b5e-a867-f15fa2957b65)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.x
- AWS Account with S3 and Lambda access
- MongoDB Atlas account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
