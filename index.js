'use strict'
/**
 * exportFn对象对外返回 extent(params1,params2) 
 * extend @param1 :当前模板字符串或 id 
 * extend @params2 data 作用于解析模板中变量的上下文对象   
 */
var exportFn = function(){
    var _compile = function(str, locals){
    var re = /{{([^%>]+)?}}/g
    var reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g
    var code = 'var r=[];\n'
    var res = null

    function add (line, jsCode) {
      if(!jsCode){
        line.replace(/"/g,"'")
      }
      var a = line ;
      jsCode
        ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n')
        : (code += line && line.length ? 'r.push("' + line.replace(/"/g, "'") + '");\n' : '')
      return add
    }

    var cursor = 0
    var match = null
    while ((match = re.exec(str)) !== null) {
      add(str.slice(cursor, match.index))(match[1], true)
      cursor = match.index + match[0].length
    }

    add(str.substr(cursor, str.length - cursor))
    code += 'return r.join("");'

    function getParams (locals){
      var obj = {
        keys:[],
        values:[]
      };
      for(var key in locals){
          obj.keys.push(key);
          obj.values.push(locals[key]);
      }
      return obj
    }
    var params = getParams(locals);

    var Fn = Function(params.keys.join(','),code.replace(/[\r\t\n]/g, ''));
    return Fn.apply(this,params.values);
      // return new Function(code.replace(/[\r\t\n]/g, '')).call(locals)
   }
   return {
      extend :function(str,data){
      //获取元素
    var element = document.getElementById(str);
    if (element) {
        //textarea或input则取value，其它情况取innerHTML
        var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
        return _compile(html, data);
    } else {
        //是模板字符串，则生成一个函数
        //如果直接传入字符串作为模板，则可能变化过多，因此不考虑缓存
        return _compile(str, data);
    }
   }
   }
}
exports.default = exportFn 