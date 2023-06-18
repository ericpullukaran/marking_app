#!/bin/bash
 
# Usage: sh my_students.sh  z1111111 z52222222
 
mkdir my_students
 
for i; do
    cp -r ./files/${i:1} ./my_students/
done