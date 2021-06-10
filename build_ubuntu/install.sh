#wget https://www.openssl.org/source/old/1.1.0/openssl-1.1.0g.tar.gz
#tar -xzvf openssl-1.1.0g.tar.gz
cd openssl-1.1.0g
sed -i 's/qw\/glob/qw\/:glob/g' `pwd`/Configure
sed -i 's/qw\/glob/qw\/:glob/g' `pwd`/test/build.info
sed -i 's/qw\/glob/qw\/:glob/g' `pwd`/util/process_docs.pl
./config linux-x86_64 --prefix=`pwd`/.. --openssldir=`pwd`/.. no-camellia no-capieng no-cast no-comp no-dso \
no-dtls1 \
no-ec_nistp_64_gcc_128\
no-gost\
no-heartbeats\
no-idea\
no-md2\
no-mdc2\
no-rc4\
no-rc5\
no-rdrand\
no-rfc3779\
no-sctp\
no-seed\
no-shared\
no-ssl-trace\
no-ssl3\
no-unit-test\
no-weak-ssl-ciphers\
no-whirlpool\
no-zlib\
no-zlib-dynamic


#make -j8
#make install