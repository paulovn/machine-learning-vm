# machine-learning-vm

This project contains the needed files to generate a virtual machine for
Machine Learning/Data Science tasks.

It is managed through Vagrant. Software requirements for the host are:
 * Vagrant 1.7.4 or above
 * VirtualBox 5.0 or above

To see what is included inside the virtual machine, look at the ChangeLog
file.

When provisioning the virtual machine, every software needed is downloaded
from Internet, with only one exception: the [Spark Kernel][sk] package, which
does not have public packages. This needs to be compiled and packaged locally,
and then made available to the Vagrantfile. The way to create that package 
is as follows:

    git clone https://github.com/ibm-et/spark-kernel
    cd spark-kernel
    vagrant ssh 
    export APACHE_SPARK_VERSION=1.5.0 
    export APACHE_HADOOP_VERSION=2.6.0 
    make build
    make dist


 [sk]: https://github.com/ibm-et/spark-kernel "Spark Kernel"
