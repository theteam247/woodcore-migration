FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update
RUN apt install -y libboost1.67-all-dev
RUN apt install -y build-essential
RUN apt install -y git build-essential  libssl-dev  libdb-dev libdb++-dev libminiupnpc-dev libqrencode-dev wget libtool
RUN apt install -y  pkg-config
RUN wget https://www.openssl.org/source/openssl-1.1.0g.tar.gz
RUN tar -zxvf openssl-1.1.0g.tar.gz -C /usr/local/src
RUN sed -i 's/qw\/glob/qw\/:glob/g' /usr/local/src/openssl-1.1.0g/Configure
RUN sed -i 's/qw\/glob/qw\/:glob/g' /usr/local/src/openssl-1.1.0g/test/build.info
RUN sed -i 's/qw\/glob/qw\/:glob/g' /usr/local/src/openssl-1.1.0g/util/process_docs.pl
RUN cd /usr/local/src/openssl-1.1.0g/ && ./config --prefix=/opt/openssl && make && make install

COPY install_db4.sh /db4/install_db4.sh
RUN cd /db4 && ./install_db4.sh `pwd`
ADD https://api.github.com/repos/team247/woodcore/git/refs/heads/master version.json
RUN git clone --depth=1 https://github.com/team247/woodcore.git
WORKDIR /woodcore
RUN cd /woodcore && ./autogen.sh && ./configure  BDB_LIBS="-L/db4/db4/lib -ldb_cxx-4.8" BDB_CFLAGS="-I/db4/db4/include" SSL_CFLAGS="-I/opt/openssl/include -L/opt/openssl/lib" SSL_LIBS="-lcrypto -lssl" --disable-ccache --disable-tests --disable-bench --with-libs=no  --without-gui  && make -j2
CMD /woodcore/src/woodcoind --debug --printtoconsole --txindex
#docker run --rm --name woodcoin -p8apt-get install python-software-properties338:8338 -p18338:18338 -vD:\woodcoindata:/root/.woodcoin woodcoin bash