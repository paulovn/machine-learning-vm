# machine-learning-vm

*Note: if you just want to set up a running Spark virtual machine, you do not 
need this project. Use the [ml-notebook][nb] project instead, that one will 
download the packaged base box and launch the VM automatically. This one is 
for building the VM from scratch*


This project contains the files needed to generate a virtual machine for
Machine Learning/Data Science tasks. When provisioning the virtual machine, 
every required piece software is downloaded from Internet. To see what is 
included inside the virtual machine and what has changed between versions, 
look at the [ChangeLog][cl] file.

The VM is managed through Vagrant. Software requirements for the host are:
 * Vagrant 2.0.1 or above (if possible, use the latest version available)
 * VirtualBox 5.0 or above

## Process

The project creates a "base" VM, with all the needed software but not
fully configured to work. Another subproject defined as a submodule, in the
[ml-notebook][nb] repository, takes care of configuring the VM for a Spark
system accessed through Jupyter Notebook in its own Vagrantfile. That
subproject uses the "base" VM as a Vagrant box to start from.

So the complete creation is a two-step process: 
 * the first step takes place here, and the produced ``spark-base64`` box is
   manually uploaded to [Vagrant Cloud][vc]
 * The second one is the one implemented in the ``Vagrantfile`` in
   [ml-notebook][nb]; it downloads the ``spark-base64`` box from the cloud and 
   finalizes the configuration

         starting box   --->     base box     --->  final VM
	    [ubuntu 20.04]        [spark-base64]


There is an additional submodule, [nbextensions][ex], which contains the
Jupyter Notebook extensions that will be copied to the base VM (note by
default they are *not* configured to automatically be included in notebooks, 
this is again taken care of in the Vagrantfile for the [ml-notebook][nb] 
subproject.) 

## Missing bits

The [base ``Vagrantfile``][bv] in this project is self-contained (downloads
everything needed from public repositories) a few exceptions. A notable one
is Spark: it installs a Spark package that assumes is locally available
(this is done to be able to install a custom Spark compiled from sources,
which is done to get a version that uses native math libraries). Alternatively
it is possible to change that in the Vagrantfile and download and install the
standard binary distribution.

 [nb]: https://github.com/paulovn/ml-vm-notebook "Spark notebook VM"
 [ex]: https://github.com/paulovn/nbextensions "Jupyter Notebook extensions"
 [vc]: https://app.vagrantup.com/paulovn/boxes/spark-base64
 [bv]: base/Vagrantfile
 [cl]: ChangeLog.txt
