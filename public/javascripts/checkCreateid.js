    function chkRegEmail(str){
        var Seiki=/[!#-9A-~]+@+[a-z0-9]+.+[^.]$/i;
        if(str!=""){
            if(str.match(Seiki)){
                return true;
            }else{
                alert("Illegal E-Mail address.");
                return false;
            }
        }else{
            alert("Please input E-Mail address.");
            return false;
        }
    }

    function isRegAlphaNum(str){
        var tmp=str.match(/[0-9a-zA-Z\-\.]+/g);
        console.log('isRegAlphaNum' + tmp);
        if (tmp!=str){
            return false;
        }else{
            return true;
        }
    }

    function isRegHan(str){
        //var tmp=str.match(/[0-9a-zA-Z\+\-\/\*\,\. ]+/g);
        var tmp=str.match(/[0-9a-zA-Z\+\-\/\*\,\.]+/g);
        console.log('isRegHan' + tmp);
        if (tmp!=str){
            return false;
        }else{
            console.log('true password');
            return true;
        }
    }

    function chkUsername(str){
      if(str!=""){
        if(isRegAlphaNum(str)){
          console.log('success');
          return true;
        }else{
          alert('Illegal character in username.');
          return false;
        }

      }else{
        alert("Please input username.")
        return false;
      }
    }

    function chkPassword(str){
      if(str!=""){
        if(isRegHan(str)){
          return true;
        }else{
          alert('Illegal character in password.');
          return false;
        }

      }else{
        alert("Please input password.")
        return false;
      }
    }

    function checkForm(){
      console.log('checkForm');

      $('form1').removeClass('warning');
      $('#name-group').removeClass('warning');
      $('#name-group').removeClass('warning');
      $('#name-group').removeClass('warning');

      var str = $('#name').val();
      if( ! chkUsername(str) ){
        $('#name-group').addClass('warning');
        $('#name').focus();
        return false;
      }
      var password = $('#pass').val();
      if( ! chkPassword(password) ){
        $('#pass-group').addClass('warning');
        $('#pass').focus();
        return false;
      }
      str = $('#mail').val();
      if(! chkRegEmail(str)){
        $('#mail-group').addClass('warning');
        $('#mail').focus();
        return false;
      }

      return true;
    }