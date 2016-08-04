ES6_DIR="js"
ES5_DIR="js_es5"

rm -r ${ES5_DIR}
mkdir ${ES5_DIR}
babel ${ES6_DIR}/ -o ${ES5_DIR}/main.js
sed -i '' -e "s/^importScript/\/\/importScript/g" ${ES5_DIR}/main.js

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
