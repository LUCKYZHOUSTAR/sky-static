;(function($){


   $.fn.DDblClick = function(options){
        return this.each(function(){
            var s = $.extend({}, $.fn.DDblClick.Default, options || {});
            var self_obj = this;
            do_click = function(e){
                clearTimeout(s.timer);
                s.timer = setTimeout(function(){s.oneclick.call(self_obj,e);}, 400);
            },
            do_dblclick = function(e) {
                clearTimeout(s.timer);
                s.dblclick.call(self_obj,e);
            };
            $(this).click(do_click).dblclick(do_dblclick);
        });
    };
    $.fn.DDblClick.Default = {
        timer: null,
        oneclick: $.noop,
        dblclick: $.noop
    };


  $.fn.TreeList = function (option){
    var Tree_List = function ($this, option){
      this.opt = option;
      this.obj = $this;
      this.callback = option.singleClick;
      this.ddcallback = option.doubleClick;
      this.init();
    };
    
    var returnarr={"id":0,
                  "name":"",
                  "show":true,
                  "checked":false 
                };
    Tree_List.prototype = {
      init: function(){
        var _this = this;
        // console.log(_this);
        //数据初始化
        _this.initData();
    },
     
      initData:function(){
        var _this = this;
        var dat = this.opt.treedata.items
          , classCount = this.opt.treedata.classCount;
        _this.showtreeclass='';

        var d = [
          'ul',
          'li',
          'ul',
          'li',
          'ul',
          'li'
        ];
        listDomFn(classCount, d, dat,$(_this.obj).attr('id'), 0);

        if (_this.opt.type=='1') {

          var click_event = function(event){
            
            returnarr.parentid=$(event.target).parent().attr('data-parentid');
            returnarr.name=$(event.target).parent().attr('data-treename');
            returnarr.id=$(event.target).parent().attr('data-id');
            event.stopPropagation();
            if ($(event.target).prop("nodeName")=='EM') {
              // return;
            }else{
              // console.log(getObjects(dat,'id',returnarr.id));
              var returndata=_this.getObjects(dat,'id',returnarr.id);
              returndata[0].show=returnarr.show;
              _this.callback(returndata);
            };
            //判断是否是点击了前边那个加号
            if ($(event.target).prop("nodeName")=='EM'){
              if ($(event.target).parent().parent().children(":first-child").next().css("display")=='none') {
                returnarr.show=true;
                $(event.target).parent().children('em:first-child').addClass('a-down').removeClass('a-up');
                 $(event.target).parent().children('em:first-child').next().removeClass('close-file').addClass('open-file');
                  $(event.target).parent().parent().children(':gt(0)').show();  
              }else{
                returnarr.show=false;
                $(event.target).parent().children('em:first-child').removeClass('a-down').addClass('a-up');
                $(event.target).parent().children('em:first-child').next().addClass('close-file').removeClass('open-file');
                $(event.target).parent().parent().children(':gt(0)').hide();
              };
            //-----------
            }else{
              if ($(event.target).parent().children(":first-child").next().css("display")=='none') {
              returnarr.show=true;
              $(event.target).children('em:first-child').addClass('a-down').removeClass('a-up');
               $(event.target).children('em:first-child').next().removeClass('close-file').addClass('open-file');
             
                $(event.target).parent().children(':gt(0)').show();  
            }else{
              returnarr.show=false;
              $(event.target).children('em:first-child').removeClass('a-down').addClass('a-up');
              $(event.target).children('em:first-child').next().addClass('close-file').removeClass('open-file');
              $(event.target).parent().children(':gt(0)').hide();
            };
            }
            };
            var dblclick_event = function(event){
              returnarr.parentid=$(event.target).parent().attr('data-parentid');
              returnarr.name=$(event.target).parent().attr('data-treename');
              returnarr.id=$(event.target).parent().attr('data-id');
              event.stopPropagation();
              if ($(event.target).prop("nodeName")=='EM') {
                // return;
              }else{
                _this.ddcallback(returnarr);
              };
            }
            $('.'+_this.opt.classname).DDblClick({oneclick:click_event,dblclick:dblclick_event});
          
          // $('.'+_this.opt.classname).click(function(event) {
            
          // });  
        }else if (_this.opt.type=='2') {
          returnarr.checked=false;
          $('.'+_this.opt.classname).click(function(event) {
            var datadom;
            if ($(event.target).parent().attr('data-id')) {
              datadom=$(event.target).parent();
            }else if ($(event.target).parent().parent().attr('data-id')){
              datadom=$(event.target).parent().parent();
            }else{
              datadom=$(event.target).parent().parent().parent();
            };
             returnarr.parentid=$(datadom).attr('data-parentid');
              returnarr.id=$(datadom).attr('data-id');
              returnarr.name=$(datadom).attr('data-treename');
            if ($(event.target)[0].localName=='input') {
              returnarr.checked=$(event.target)[0].checked;
            }else{
              returnarr.checked=null;
            };

            if ($(event.target).parent().children(":first-child").next().css("display")=='none') {
              returnarr.show=true;
              $(event.target).children('em:first-child').addClass('a-down').removeClass('a-up');
              $(event.target).children('em:first-child').next().removeClass('close-file').addClass('open-file');
              $(event.target).parent().children(':gt(0)').show();

              if ($(event.target).parent().children(':first-child').next().children().length=='1') {
              };
              
            }else{
              returnarr.show=false;
              $(event.target).children('em:first-child').removeClass('a-down').addClass('a-up');
              $(event.target).children('em:first-child').next().addClass('close-file').removeClass('open-file');
              $(event.target).parent().children(':gt(0)').hide();
            };
            event.stopPropagation();
            // _this.callback(returnarr);
            var returndata=_this.getObjects(dat,'id',returnarr.id);
            returndata[0].show=returnarr.show;
            returndata[0].checked=returnarr.checked;
            _this.callback(returndata);
            // _this.callback(_this.getObjects(dat,'id',returnarr.id));
          });  
        }else if (_this.opt.type=='3'){
          $('.'+_this.opt.classname).click(function(event) {
            returnarr.parentid=$(event.target).parent().attr('data-parentid');
            returnarr.name=$(event.target).parent().attr('data-treename');
            returnarr.id=$(event.target).parent().attr('data-id');
            $(_this.obj).prev().find('em').html(returnarr.name);
            $(_this.obj).hide();
            event.stopPropagation();
             _this.callback(_this.getObjects(dat,'id',returnarr.id));
            // _this.callback(returnarr);
          });
          $(_this.obj).prev().click(function(event) {
            if ($(_this.obj).css('display')=='none') {
              $(_this.obj).prev().find('span').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
              $(_this.obj).show();
            }else{
              $(_this.obj).prev().find('span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
              $(_this.obj).hide();
            };
          });
        }else  if (_this.opt.type=='4') {
          
            $('.'+_this.opt.classname).click(function(event) {
              if ($(event.target).hasClass('tree-wz') || $(event.target).hasClass('ahref')) {return;};
             
            returnarr.parentid=$(event.target).parent().attr('data-parentid')?$(event.target).parent().attr('data-parentid'):$(event.target).parent().parent().attr('data-parentid');
            returnarr.name=$(event.target).parent().attr('data-treename')?$(event.target).parent().attr('data-treename'):$(event.target).parent().parent().attr('data-treename');
            returnarr.id=$(event.target).parent().attr('data-id')?$(event.target).parent().attr('data-id'):$(event.target).parent().parent().attr('data-id');
            event.stopPropagation();
             _this.callback(_this.getObjects(dat,'id',returnarr.id));
            // _this.callback(returnarr);

            if ($(event.target).parent().parent().children(":first-child").next().css("display")=='none') {
              returnarr.show=true;
               $(event.target).parent().children('em:first-child').next().removeClass('close-file').addClass('open-file');
              $(event.target).parent().children('em:first-child').addClass('a-down').removeClass('a-up');
              $(event.target).parent().parent().children(':gt(0)').show();  
            }else{
              returnarr.show=false;
              $(event.target).parent().children('em:first-child').removeClass('a-down').addClass('a-up');
              $(event.target).parent().children('em:first-child').next().addClass('close-file').removeClass('open-file');
              $(event.target).parent().parent().children(':gt(0)').hide();
            };
          });  
        };

      
        function listDomFn(classCount, d, dat, id, c, k){
          for(var i = 0; i<dat.length; i++){
              var idName = k!=null ? k  + '_' + (i+1) : id+'_' + (i+1);
              var item='';
              item =item+ '<'+d[c]+' id="'+idName+'" data-treename="'+dat[i].name+'" data-id="'+dat[i].id+'" data-parentid="'+dat[i].parentId+'"';

              if (k!=null &&!_this.opt.showtree && (_this.opt.type=='1' ||_this.opt.type=='2' ||_this.opt.type=='4')) {
                // item =item+' style="display:none;">';
                item =item+' style="display:none;">';
              }else{
                item =item+'>';  
              };

              if ((_this.opt.type=='1'&&dat[i].leaves.length>0)||(_this.opt.type=='2'&&dat[i].leaves.length>0) ) {
                item=item+'<span class="'+_this.opt.classname+'  tree-wz"><em class="a-up"></em><em class="close-file"></em>';
                item =item+dat[i].name+'</span></'+d[c]+'>';

              }else if ((_this.opt.type=='1')) {
                var url=window.location.pathname;
               item=item+'<span  class="'+_this.opt.classname+'"><em class="file"></em>'+dat[i].name;
                item =item+'</span></'+d[c]+'>';

              }else if (_this.opt.type=='2') {
               item=item+'<span  class="'+_this.opt.classname+' check-box"><em class="pr10"><input type="checkbox" />'+dat[i].name+'</em>  ';
                item =item+'</span></'+d[c]+'>';

              }else if (_this.opt.type=='3'){
                item =item+'<span  class="'+_this.opt.classname+'">'+dat[i].name+'</span></'+d[c]+'>';  

              }else if (_this.opt.type=='4') {
                var url=dat[i].url?dat[i].url:window.location.pathname;
                if (dat[i].leaves.length>0) {
                  item=item+'<span class="'+_this.opt.classname+'  tree-wz"><em class="a-up"></em><em class="close-file"></em>';
                item =item+'<a href="'+url+'" class="ahref">'+dat[i].name+'</a></span></'+d[c]+'>';
                }else{
                item=item+'<span  class="'+_this.opt.classname+'"><em class="file"></em>'+dat[i].name;
                item =item+'</span></'+d[c]+'>';   
                };
              };
              
              if(c <= classCount){
                  $("#"+id).append(item);
                  if(dat[i].leaves.length > 0){
                      listDomFn(classCount, d, dat[i].leaves, idName, c+1, idName);
                  }
              }
          };
        };
        
      },
      //数据处理
      dataRender : function(){
        var _this = this;
      },

      getObjects:function (obj, key, val) {
          var objects = [];
          for (var i in obj) {
              if (!obj.hasOwnProperty(i)) continue;
              if (typeof obj[i] == 'object') {
                  objects = objects.concat(this.getObjects(obj[i], key, val));    
              } else 
              //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
              if (i == key && obj[i] == val || i == key && val == '') { //
                  objects.push(obj);
              } else if (obj[i] == val && key == ''){
                  //only add if the object is not already in the array
                  if (objects.lastIndexOf(obj) == -1){
                      objects.push(obj);
                  }
              }
          }
          return objects;
      },

      getValues:function (obj, key) {
          var objects = [];
          for (var i in obj) {
              if (!obj.hasOwnProperty(i)) continue;
              if (typeof obj[i] == 'object') {
                  objects = objects.concat(getValues(obj[i], key));
              } else if (i == key) {
                  objects.push(obj[i]);
              }
          }
          return objects;
      },

      getKeys:function (obj, val) {
          var objects = [];
          for (var i in obj) {
              if (!obj.hasOwnProperty(i)) continue;
              if (typeof obj[i] == 'object') {
                  objects = objects.concat(getKeys(obj[i], val));
              } else if (obj[i] == val) {
                  objects.push(i);
              }
          }
          return objects;
      }

    };
    /**
      * [组件说明]
      *列表树展开
      *调用说明:
      $("#list").TreeList({
        treedata:{"items": [{"id": "3",name:"test"}]，classCount：3},
        type:1,
        showtree:true,
        classname:'treedom',
        singleClick: function(data) {
          console.log(data);
          //这里可以通过data获得相应数值
        },
        doubleClick:function() {  
        }//双击事件
      });
      * 参数说明：
        treedata: json数据
        type:1, 类型1为树形跳转，类型2为树形选择框，类型3为下拉 ，4为每级可跳转
        classname:'treedom',区别各个菜单中的事件名字
        showtree:是否直接显示树形结构
     *返回值：
      {
        id:tree_1,  点击的项的编号
        name:test， 点击的项的内容
        show: true 显示还是隐藏（弹出菜单此项无用）
        checked:true input选中还是未选中
        parentid: 父级id
       }
     */
    var config = {
      treedata:{"items": [{"id": "3"}]},
      type:1,
      showtree:true,
      classname:'treedom',
      singleClick:function() {       
      },
      doubleClick:function() {       
      }

    }
    option = $.extend(config, option);    
    new Tree_List($(this), option);
  };
})(jQuery);