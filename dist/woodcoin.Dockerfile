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
RUN git clone --depth=1 https://github.com/team247/woodcore.git
WORKDIR /woodcore
RUN cd /woodcore && ./autogen.sh && ./configure  SSL_CFLAGS="-I/opt/openssl/include -L/opt/openssl/lib" SSL_LIBS="-lcrypto -lssl" --disable-ccache   --disable-tests --with-libs=no  --without-gui --disable-wallet && make -j2
CMD /woodcore/src/woodcoind --debug --printtoconsole
#docker run --rm --name woodcoin -p8apt-get install python-software-properties338:8338 -p18338:18338 -vD:\woodcoindata:/root/.woodcoin woodcoin bash