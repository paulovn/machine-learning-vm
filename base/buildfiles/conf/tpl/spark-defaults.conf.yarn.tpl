# The address of the master: ask Yarn
spark.master=yarn-client

# Where to put event logs
spark.eventLog.enabled=true
spark.eventLog.dir={DIR-EVENTLOG}

# Tell yarn to connect to Spark History server
spark.yarn.historyServer.address={HOSTNAME-SPARK-HS}
spark.yarn.preserve.staging.files=false

# The place in the cluster where to find the Spark Yarn assembly JAR
spark.yarn.jar=hdfs://{HOSTNAME-NAMENODE}:8020/user/spark/share/lib/spark-assembly.jar

#spark.driver.host	10.95.228.27
#spark.driver.port	4041
#spark.fileserver.port	4042
#spark.broadcast.port	4043
#spark.replClassServer.port 4044
#spark.blockManager.port 4045
