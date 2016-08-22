ES6_DIR="game_assets/js"
ES5_DIR="game_assets/js"

if [ $# -ne 1 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには1個の引数が必要です。(develop or production)" 1>&2
  exit 1
fi

FILE_PATH=${1}/${ES5_DIR}/main.js
echo ${FILE_PATH}

mkdir -p ${1}/${ES5_DIR}
babel ${ES6_DIR}/ -o ${FILE_PATH}
sed -i '' -e "s/^importScript/\/\/importScript/g" ${FILE_PATH}

rm -r ${1}/game_assets/images/
cp -r game_assets/images ${1}/game_assets/
rm -r ${1}/game_assets/css/
cp -r game_assets/css ${1}/game_assets/


# babel $ES6_DIR"/" -o "js/main_es5.js"
#
# exit 0;

# for file in `\find $ES6_DIR -name '*.js'`; do
#   echo $file;
#   babel "${file}" -o "${ES5_DIR}/`basename ${file}`"
#
#   echo ${ES5_DIR}/`basename ${file}`
#   sed -i '' e "s/importScript/\/\/importScript/g" js/main2.js
#   # sed -i '' e "s!importScript('${ES6_DIR}/\(.*\)');!importScript('${ES5_DIR}/\1)');!g" ${ES5_DIR}/`basename ${file}`
# done
