#!/bin/bash

#	- This is the main script that is used to compile/interpret the source code
# - This script will be executed in docker container.
#	- The script takes 3 arguments
#		1. The compiler that is to compile the source file.
#		2.d The source file that is to be compiled/interprete
#		3. Additional argument only needed for compilers, to execute the object code
#	
#	- Sample execution command:   $: ./script.sh g++ file.cpp ./a.out

compiler=$1
file=$2
output=$3
additionArg=$4

if [ $output = "" ] then
  $compiler /usercode/$file