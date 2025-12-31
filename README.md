# TaskFlow — DevSecOps CI/CD Project 🚀

Deploy a robust Task Management application using a secure CI/CD pipeline built with **Jenkins**, **Docker** 🐳, and **Kubernetes** ☸️. This project requires implementing code quality and security tools (**SonarQube**, **Trivy**), as well as monitoring solutions (**Prometheus**, **Grafana**) to ensure reliability and visibility.

## 📋 Project Overview
This project demonstrates a complete DevSecOps workflow:
1.  **Dockerized Local Testing**: Deploy the application in a Docker container.
2.  **Code Quality & Security**: SonarQube for analysis, Trivy for vulnerability scanning.
3.  **CI/CD Pipeline**: Jenkins automation for building, testing, and pushing images.
4.  **Monitoring**: Prometheus and Grafana for system health and metrics.
5.  **Kubernetes Deployment**: Deploying to k8s (EKS/Minikube) using ArgoCD.

---

## Phase 1: Initial Setup and Deployment

### Step 1: Clone the Code
Clone this repository to your instance:
```bash
git clone https://github.com/sarika-03/TaskFlow.git
cd TaskFlow
```

### Step 2: Install Docker and Run Locally
Set up Docker on your system (Ubuntu example):
```bash
sudo apt-get update
sudo apt-get install docker.io -y
sudo usermod -aG docker $USER
newgrp docker
sudo chmod 777 /var/run/docker.sock
```

Build and run the application:
```bash
docker build -t taskflow .
docker run -d --name taskflow -p 3000:3000 taskflow:latest
```
Access the app at `http://<your-ip>:3000`.

To stop/remove:
```bash
docker stop taskflow
docker rm taskflow
```

---

## Phase 2: Security Setup (SonarQube & Trivy)

### Step 1: Run SonarQube
Run SonarQube in a Docker container:
```bash
docker run -d --name sonar -p 9000:9000 sonarqube:lts-community
```
Access at `http://<your-ip>:9000` (Default: admin/admin).

### Step 2: Install Trivy
```bash
sudo apt-get install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

---

## Phase 3: CI/CD Setup with Jenkins

### Step 1: Install Jenkins
Install Java 17 and Jenkins:
```bash
sudo apt update
sudo apt install fontconfig openjdk-17-jre
# Follow official Jenkins installation guide for your OS
sudo systemctl start jenkins
```
Access Jenkins at `http://<your-ip>:8080`.

### Step 2: Install Plugins
Go to **Manage Jenkins → Plugins** and install:
*   Eclipse Temurin Installer
*   SonarQube Scanner
*   NodeJS Plugin
*   OWASP Dependency-Check
*   Docker Pipeline, Docker API, docker-build-step
*   Email Extension Plugin

### Step 3: Configure Tools
**Manage Jenkins → Tools**:
*   **JDK**: Name `jdk17`, Install automatically (Java 17).
*   **NodeJS**: Name `node16`, Install automatically (Node 16).
*   **SonarQube Scanner**: Name `sonar-scanner`.
*   **Dependency-Check**: Name `DP-Check`.

### Step 4: Configure Credentials
**Manage Jenkins → Credentials**:
*   **Sonar-token**: Secret text (Token from SonarQube User settings).
*   **docker**: Username/Password for Docker Hub.

### Step 5: The Pipeline
Use the `Jenkinsfile` included in this repository. It defines stages for:
1.  **Checkout**: Pulls code.
2.  **SonarQube Analysis**: Scans code.
3.  **Quality Gate**: Enforces quality standards.
4.  **Install Dependencies**: `npm install`.
5.  **OWASP Scan**: Checks dependencies for CVEs.
6.  **Trivy FS Scan**: Scans filesystem.
7.  **Docker Build & Push**: Builds `taskflow` image and pushes to Docker Hub.
8.  **Trivy Image Scan**: Scans the container image.
9.  **Deploy**: Runs the container.

---

## Phase 4: Monitoring (Prometheus & Grafana)

### Step 1: Install Prometheus
Download and configure Prometheus to scrape metrics.
Update `prometheus.yml` to include:
```yaml
scrape_configs:
  - job_name: "jenkins"
    metrics_path: "/prometheus"
    static_configs:
      - targets: ["<jenkins-ip>:8080"]
```

### Step 2: Install Grafana
1.  Install Grafana.
2.  Add **Prometheus** as a Data Source.
3.  Import Dashboards (e.g., Node Exporter, Jenkins).

---

## Phase 5: Kubernetes & ArgoCD
For production deployment:
1.  Provision a Kubernetes cluster (EKS, Minikube, etc.).
2.  Install **ArgoCD**.
3.  Create an ArgoCD App pointing to the `Kubernetes/` folder in this repo.
4.  ArgoCD will sync and deploy `deployment.yml` and `service.yml`.


---

## Repository Structure
*   `backend/` - Node.js Express API.
*   `frontend/` - Static HTML/JS Frontend.
*   `Kubernetes/` - Manifests for k8s deployment.
*   `monitoring/` - Prometheus/Grafana configs.
*   `Jenkinsfile` - CI/CD Pipeline definition.
*   `Dockerfile` - Container instructions.

---
**Maintained by**: Sarika
