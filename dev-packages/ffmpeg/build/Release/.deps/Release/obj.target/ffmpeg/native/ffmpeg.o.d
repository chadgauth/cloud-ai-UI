cmd_Release/obj.target/ffmpeg/native/ffmpeg.o := cc -o Release/obj.target/ffmpeg/native/ffmpeg.o ../native/ffmpeg.c '-DNODE_GYP_MODULE_NAME=ffmpeg' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-DV8_DEPRECATION_WARNINGS' '-DV8_IMMINENT_DEPRECATION_WARNINGS' '-D_GLIBCXX_USE_CXX11_ABI=1' '-D_DARWIN_USE_64_BIT_INODE=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DNAPI_VERSION=2' '-DBUILDING_NODE_EXTENSION' -I/Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node -I/Users/jeremywang/Library/Caches/node-gyp/20.5.1/src -I/Users/jeremywang/Library/Caches/node-gyp/20.5.1/deps/openssl/config -I/Users/jeremywang/Library/Caches/node-gyp/20.5.1/deps/openssl/openssl/include -I/Users/jeremywang/Library/Caches/node-gyp/20.5.1/deps/uv/include -I/Users/jeremywang/Library/Caches/node-gyp/20.5.1/deps/zlib -I/Users/jeremywang/Library/Caches/node-gyp/20.5.1/deps/v8/include  -O3 -gdwarf-2 -flto -mmacosx-version-min=10.15 -arch x86_64 -Wall -Wendif-labels -W -Wno-unused-parameter -fno-strict-aliasing -MMD -MF ./Release/.deps/Release/obj.target/ffmpeg/native/ffmpeg.o.d.raw   -c
Release/obj.target/ffmpeg/native/ffmpeg.o: ../native/ffmpeg.c \
  /Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/node_api.h \
  /Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/js_native_api.h \
  /Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/js_native_api_types.h \
  /Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/node_api_types.h \
  ../native/ffmpeg.h
../native/ffmpeg.c:
/Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/node_api.h:
/Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/js_native_api.h:
/Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/js_native_api_types.h:
/Users/jeremywang/Library/Caches/node-gyp/20.5.1/include/node/node_api_types.h:
../native/ffmpeg.h:
