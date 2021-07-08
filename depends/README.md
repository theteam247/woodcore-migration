### Usage

#### build windows exe file on ubuntu.

```
sudo apt-get install git make automake cmake curl g++-multilib libtool binutils-gold bsdmainutils 
sudo apt-get install pkg-config python3 patch bison build-essential g++-mingw-w64-x86-64 nsis
echo 1 | sudo update-alternatives --config x86_64-w64-mingw32-g++
git clone https://github.com/team247/woodcore.git
cd woodcore/depends
make HOST=x86_64-w64-mingw32 -j4
cd ..
CONFIG_SITE=$PWD/depends/x86_64-w64-mingw32/share/config.site ./configure
make -j4
```

or build for linux:

....

```
make HOST=x86_64-pc-linux-gnu -j4
cd ..
CONFIG_SITE=$PWD/depends/x86_64-pc-linux-gnu/share/config.site ./configure
make -j4
```

Common `host-platform-triplet`s for cross compilation are:

- `x86_64-pc-linux-gnu` for x86 Linux
- `x86_64-w64-mingw32` for Win64
- `x86_64-apple-darwin18` for macOS

  

### Install the required dependencies: Ubuntu & Debian

#### For macOS cross compilation

    sudo apt-get install curl librsvg2-bin libtiff-tools bsdmainutils cmake imagemagick libz-dev python3-setuptools libtinfo5 xorriso cpio

Note: You must obtain the macOS SDK before proceeding with a cross-compile.
Under the depends directory, create a subdirectory named `SDKs`.
Then, place the extracted SDK under this new directory.
For more information, see [SDK Extraction](../contrib/macdeploy/README.md#sdk-extraction).



