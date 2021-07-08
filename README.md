### demo:

http://15.164.152.116:9332/webgui/#/blocks/

<u>account:</u>theteam247

<u>password:</u>theteam247pwd

### build for windows on ubuntu:

```
sudo apt-get install git make automake cmake curl g++-multilib libtool binutils-gold bsdmainutils 
sudo apt-get install pkg-config python3 patch bison build-essential g++-mingw-w64-x86-64 nsis
echo 1 | sudo update-alternatives --config x86_64-w64-mingw32-g++
git clone https://github.com/team247/woodcore.git
cd woodcore/depends
make HOST=x86_64-w64-mingw32 -j4
cd ..
./autogen.sh
CONFIG_SITE=$PWD/depends/x86_64-w64-mingw32/share/config.site ./configure
make -j4
```

### build for linux:

```
sudo apt-get install git make automake cmake curl g++-multilib libtool binutils-gold bsdmainutils
sudo apt-get install pkg-config python3 patch bison build-essential
git clone https://github.com/team247/woodcore.git
cd woodcore/depends
make HOST=x86_64-pc-linux-gnu -j4
cd ..
./autogen.sh
CONFIG_SITE=$PWD/depends/x86_64-pc-linux-gnu/share/config.site ./configure
make -j4
```



Common `host-platform-triplet`s for cross compilation are:

- `x86_64-pc-linux-gnu` for x86 Linux (make HOST=x86_64-pc-linux-gnu -j4)
- `x86_64-w64-mingw32` for Win64 (make HOST=x86_64-pc-linux-gnu -j4)
- `x86_64-apple-darwin18` for macOS

#### For macOS cross compilation

    sudo apt-get install curl librsvg2-bin libtiff-tools bsdmainutils cmake imagemagick libz-dev python3-setuptools libtinfo5 xorriso cpio

Note: You must obtain the macOS SDK before proceeding with a cross-compile.
Under the depends directory, create a subdirectory named `SDKs`.
Then, place the extracted SDK under this new directory.
For more information, see [SDK Extraction](../contrib/macdeploy/README.md#sdk-extraction).
