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
SPARK_LOCAL_IP=$(localip eth1 eth0)
#SPARK_PUBLIC_DNS=
#SPARK_LOCAL_HOSTNAME=
#SPARK_PUBLIC_DNS=

PYSPARK_PYTHON=python2.7
PYSPARK_SUBMIT_ARGS="--master yarn-client --deploy-mode client  --driver-memory 1536M  --num-executors 16 --executor-cores 2 --executor-memory 1g"

# This is for running in Yarn modes
HADOOP_CONF_DIR=/opt/spark/current/conf/hadoop
YARN_CONF_DIR=/opt/spark/current/conf/hadoop
#YARN_OPTS="--conf spark.yarn.historyServer.address={HOSTNAME-SPARK-HS}"


#SPARK_PUBLIC_DNS=kongoni
#SPARK_LOCAL_HOSTNAME=10.95.228.27
#SPARK_PUBLIC_DNS=10.95.230.226
