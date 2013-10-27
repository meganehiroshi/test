 function onLoad()
  {
      var content = document.getElementById( 'ggnews' );
	  var options = {
	                 format: '728x90',    // 表示サイズ
	                 queryList: [
	                     {
	                         topic: 'h',     // 表示するトピック (話題)
	                         rez: 'small',   // 表示すニュースの件数
	                         q: '政治'
	                     },
	                 ]
	               };
      // NewsShowオブジェクトを作成し、表示する
      new google.elements.NewsShow( content, options );
  }

  // NewsShowのAPIをロードする
  google.load( 'elements', '1', { packages : [ 'newsshow' ] } );

  // ドキュメントがロードされた後に呼び出されるハンドラ関数を登録する
  google.setOnLoadCallback( onLoad );





/*
function onLoad()
  {
      var restriction = { topic:'h', ned:'jp' ,oq:'政治' };

      var newsSearch = new google.search.NewsSearch();
      newsSearch.setSearchCompleteCallback( this, SearchComplete, [ newsSearch ] );
      newsSearch.setRestriction( google.search.Search.RESTRICT_EXTENDED_ARGS, restriction );

      newsSearch.execute( '' );
  }

  function SearchComplete( searcher )
  {
      if( searcher.results )
      {
          var content = document.getElementById( 'ggnews' );
          for( var i = 0; i < searcher.results.length; i++ )
          {
              content.appendChild( searcher.results[ i ].html );
          }
      }
  }

  google.load( 'search', '1' );
  google.setOnLoadCallback( onLoad );

*/