all:index.o mainjs.o vendor.o manifest.o
	echo "all"
%.o:%.html
	objcopy -I binary -O elf64-x86-64 -B i386:x86-64 $^ $@
%.o:%.js
	objcopy -I binary -O elf64-x86-64 -B i386:x86-64 $^ $@	
clean:
	rm *.o
