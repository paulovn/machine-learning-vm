# machine-learning-vm

*Note: if you just want to set up a running Spark virtual machine, you do not 
need this project. Use the [ml-notebook][nb] project instead, that one will 
download the packaged base box and launch the VM automatically. This one is 
for building the VM from scratch*


This project contains the files needed to generate a virtual machine for
Machine Learning/Data Science tasks.

It is managed through Vagrant. Software requirements for the host are:
 * Vagrant 1.7.4 or above
 * VirtualBox 5.0 or above

To see what is included inside the virtual machine, look at the ChangeLog
file.

The project creates a "base" VM, with all the needed software but not
configured to launch. Another subproject defined as a submodule, in the
[ml-notebook][nb] repository, takes care of configuring the VM for a Spark
system accessed through Jupyter Notebook. That subproject uses the "base" 
VM as a Vagrant box to start from.

There is an additional submodule, [nbextensions][ex], which contains the
Jupyter Notebook extensions that will be copied to the base VM (note they are
*not* configured to automatically be included in notebooks) 

When provisioning the virtual machine, every software needed is downloaded
from Internet, with only one exception: the [Spark Kernel][sk] package, which
does not have public packages. This needs to be compiled and packaged locally,
and then made available to the Vagrantfile. The way to create that package 
is as follows:

    git clone https://github.com/ibm-et/spark-kernel
    cd spark-kernel
    vagrant up
    vagrant ssh 
    cd /vagrant
    export APACHE_SPARK_VERSION=1.6.0 
    export APACHE_HADOOP_VERSION=2.6.0 
    make clean
    make build
    make dist


 [sk]: https://github.com/ibm-et/spark-kernel "Spark Kernel"
 [nb]: https://github.com/paulovn/ml-vm-notebook "Spark notebook VM"
 [ex]: https://github.com/paulovn/nbextensions "Jupyter Notebook extensions"
