#!/bin/sh

# Find node IPs for a list of interfaces
localip()
{
    for if in $*; do
	IP=$(ifconfig $if 2>/dev/null | grep 'inet addr' | cut -d: -f2 | cut -d' ' -f1)
	test "$IP" && break
    done
    echo $IP
}

# Set the local IP that Spark advertises
# Try first eth1, which will usually be the bridged network
test "$SPARK_LOCAL_IP" || SPARK_LOCAL_IP=$(localip eth1 eth0)

#SPARK_PUBLIC_DNS=
#SPARK_LOCAL_HOSTNAME=
#SPARK_PUBLIC_DNS=

# Compatibiliy Setting for PyArrow >= 0.15.0
#ARROW_PRE_0_15_IPC_FORMAT=1

# Set the Python to use
PYSPARK_PYTHON=/opt/ipnb/bin/python
# Set Python for Driver -- but only if not set (to allow Jupyter notebook to run)
PYSPARK_DRIVER_PYTHON=${PYSPARK_DRIVER_PYTHON:-/opt/ipnb/bin/ipython}
# Default arguments for job submission
PYSPARK_SUBMIT_ARGS="--deploy-mode client  --driver-memory 1536M  --num-executors 16 --executor-cores 2 --executor-memory 1g"
