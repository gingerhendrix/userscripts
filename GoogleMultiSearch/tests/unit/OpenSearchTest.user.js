// ==UserScript==
// @name          OpenSearchTest
// @namespace     http://gandrew.com/projects/GoogleMultiSearch/tests/unit
// @description   Unit Tests for the opensearch library 
// @include       <?php echo $testHarness ?> 
// @require lib/GMUnit.js
// @require OpenSearch.js

// omitted xmlns="http://a9.com/-/spec/opensearch/1.1/"
var testOSDXML = <OpenSearchDescription>
   <ShortName>Web Search</ShortName>
   <Description>Use Example.com to search the Web.</Description>
   <Tags>example web</Tags>
   <Contact>admin@example.com</Contact>
   <Url type="application/atom+xml"
        template="http://example.com/?q={searchTerms}&amp;pw={startPage?}&amp;format=atom"/>
   <Url type="application/rss+xml"
        template="http://example.com/?q={searchTerms}&amp;pw={startPage?}&amp;format=rss"/>
   <Url type="text/html" 
        template="http://example.com/?q={searchTerms}&amp;pw={startPage?}"/>
   <LongName>Example.com Web Search</LongName>
   <Image height="64" width="64" type="image/png">http://example.com/websearch.png</Image>
   <Image height="16" width="16" type="image/vnd.microsoft.icon">http://example.com/websearch.ico</Image>
   <Query role="example" searchTerms="cat" />
   <Developer>Example.com Development Team</Developer>
   <Attribution>
     Search data Copyright 2005, Example.com, Inc., All Rights Reserved
   </Attribution>
   <SyndicationRight>open</SyndicationRight>
   <AdultContent>false</AdultContent>
   <Language>en-us</Language>
   <OutputEncoding>UTF-8</OutputEncoding>
   <InputEncoding>UTF-8</InputEncoding>
 </OpenSearchDescription>;
 


new Test("OpenSearchTest", function(test){
  var os = OpenSearch.fromXML(testOSDXML.toXMLString());
  test.assertEquals("Web Search", os.name, "Incorrect name");
  test.assertEquals("Use Example.com to search the Web.", os.description,  "Incorrect description");
  
  test.assertEquals(2, os.tags.length,  "Incorrect description");
  ["example", "web"].map(function(tag){
    test.assertContains(tag, os.tags, "Incorrect tags");  
  });
  
  test.assertEquals(3, os.urls.length,  "Incorrect urls");
  
  [{type: "text/html", template : "http://example.com/?q={searchTerms}&pw={startPage?}"},
   {type: "application/rss+xml", template : "http://example.com/?q={searchTerms}&pw={startPage?}&format=rss"},
   {type: "application/atom+xml", template : "http://example.com/?q={searchTerms}&pw={startPage?}&format=atom"},
  ].map(function(url){
    test.assertContains(url, os.urls, "Incorrect urls");
  });
  
  [{type: "image/png", width: 64, height: 64, href : "http://example.com/websearch.png"},
   {type: "image/vnd.microsoft.icon", width: 16, height: 16, href: "http://example.com/websearch.ico"},
  ].map(function(img){
    test.assertContains(img, os.images, "Incorrect images");
  });
  
});