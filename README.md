# machine-learning-vm

*Note: if you just want to set up a running Spark virtual machine, you do not 
need this project. Use the [ml-notebook][nb] project instead, that one will 
download the packaged base box and launch the VM automatically. This one is 
for building the VM from scratch*


This project contains the files needed to generate a virtual machine for
Machine Learning/Data Science tasks. When provisioning the virtual machine, 
every required piece software is downloaded from Internet. To see what is 
included inside the virtual machine, look at the ChangeLog file.


The VM is managed through Vagrant. Software requirements for the host are:
 * Vagrant 1.7.4 or above
 * VirtualBox 5.0 or above


The project creates a "base" VM, with all the needed software but not
configured to launch. Another subproject defined as a submodule, in the
[ml-notebook][nb] repository, takes care of configuring the VM for a Spark
system accessed through Jupyter Notebook. That subproject uses the "base" 
VM as a Vagrant box to start from.

There is an additional submodule, [nbextensions][ex], which contains the
Jupyter Notebook extensions that will be copied to the base VM (note they are
*not* configured to automatically be included in notebooks) 


 [nb]: https://github.com/paulovn/ml-vm-notebook "Spark notebook VM"
 [ex]: https://github.com/paulovn/nbextensions "Jupyter Notebook extensions"
 [tr]: https://toree.incubator.apache.org/ "Apache Toree"
