/**
 * Created by baultik on 2/2/17.
 */
(function () {
    var embedPreview = null;
    var timer = null;

    $(document).ready(function() {
        $("body").on('click','.grid-item',(function(){
            updatePreview(this);
        }));

        $("body").on('click','.grid-item-f',(function(){
            updatePreview(this);
        }));

        $(window).resize(function () {
            onResize(500,updateFullScreen);
        });

        embedPreview = new Preview();
        embedPreview.init();
    });

    function updatePreview(parent){
        var index = $(parent).attr('data-index');
        var item = main_array[index];

        preview.show();
        embedPreview.play(item);
    }

    function closePreview(){
        embedPreview.stop();
        preview.hide();
    }

    //TODO: account for window resizing
    function updateFullScreen() {

    }

    function onResize(time, callback) {
        //console.log("Resized setting timer");
        if (timer != null) {
            clearTimeout(timer);
        }

        timer = setTimeout(callback,time);
    }

    function Preview() {
        this.data = null;
        this.previewElement = $('#preview');
        this.expandBtn = $("#open_full");
        this.contractBtn = $("#close_full");
        this.closeBtn = $("#close_preview");
        this.iframeVideoElement = null;
        this.iframeChatElement = null;
        this.videoSrc = "";
        this.chatSrc = "";
        this.animationTime = 250;
        this.defaultWidth = 0;
        this.defaultHeight = 0;
        this.expandedBtnGutter = 40;
        this.expanded = false;
    }

    Preview.prototype.init = function () {
        //get initial size
        this.defaultWidth = this.preview.width();
        this.defaultHeight = this.preview.height();

        this.previewElement.on('click','#close_preview',closePreview);
        this.previewElement.on('click','#open_full',this.expand.bind(embedPreview));
        this.previewElement.on('click','#close_full',this.contract.bind(embedPreview));

        //Create iframes - used until preview is close
        this.iframeChatElement = $("<iframe>",
            {frameborder:"0",scrolling:"no",width:this.defaultWidth+"px",height:this.defaultHeight+"px",src:"about:blank"})
            .css({position: "absolute",display:"inline-block",left:"0",top:"0"});
        this.preview.append(this.iframeChatElement);

        this.iframeVideoElement = $("<iframe>",
            {frameborder:"0",scrolling:"no",width:this.defaultWidth+"px",height:this.defaultHeight+"px",src:"about:blank"})
            .css({position: "absolute",display:"inline-block",left:"0",top:"0"});
        this.preview.append(this.iframeVideoElement);

        if (this.defaultWidth > $(window).width()) {
            this.position(true,0);
        }
    };

    Preview.prototype.expand = function () {
        //get buttons and hide them
        this.contractBtn.hide();
        this.expandBtn.hide();
        this.closeBtn.hide();
        this.expanded = true;//save state

        //animate position
        this.position(true, this.animationTime, function () {
            //show appropriate buttons
            this.closeBtn.css({transform:"none"});
            this.contractBtn.show();
            this.closeBtn.show();
        });
    };

    Preview.prototype.contract = function () {
        //get buttons and hide them
        this.contractBtn.hide();
        this.expandBtn.hide();
        this.closeBtn.hide();
        this.expanded = false;//save state

        //animate position
        this.position(false, this.animationTime, function () {
            //show appropriate buttons
            this.closeBtn.css({transform:"translate(-50%,-50%)"});
            this.expandBtn.show();
            this.closeBtn.show();
        });
    };

    Preview.prototype.position = function (expanded,time,callback) {
        //get main div and content div and sizes
        var prevWidth = this.defaultWidth, prevHeight = this.defaultHeight;
        var contentWidth = prevWidth, contentHeight = prevHeight, contentLeft = 0;

        if (expanded) {
            //if fullscreen changes sizes to fullscreen layout
            prevWidth = $(window).width();
            prevHeight = $(window).height();
            contentWidth = prevWidth - this.expandedBtnGutter;
            contentHeight = prevHeight;
            contentLeft = this.expandedBtnGutter;
        }

        //set up sizes for video and chat and position for chat
        var vWidth = contentWidth,  cWidth = vWidth;
        var vHeight = contentHeight, cHeight = vHeight;
        var top = 0, left = 0;

        if (expanded) {
            //If fullscreen account for if screen is taller than wide - otherwise use default sizes with chat hidden
            if (contentHeight > contentWidth) {
                //Make video full width at appropriate aspect ratio with chat filling below
                vHeight = contentWidth * 0.5625;
                top = vHeight;
                cHeight = contentHeight - top;
            } else {
                //Make video and chat side by side
                vWidth = contentWidth * 0.75;
                left = vWidth;
                cWidth = contentWidth - left;
            }
        }
        //Animate to sizes
        this.preview.animate({width:prevWidth,height:prevHeight},time,callback);
        this.iframeVideoElement.animate({width:vWidth,height:vHeight,left:contentLeft},time);
        this.iframeChatElement.animate({width:cWidth,height:cHeight,left:left,top:top},time);
    };

    Preview.prototype.play = function (data) {
        //Get embed data
        this.data = data;
        this.videoSrc = this.data.source==="twitch" ? this.data.embedVideo :
            this.data.embedVideo+"?&autoplay=1&fs=0&modestbranding=1&playsinline=1&rel=0";
        this.chatSrc = this.data.embedChat;

        this.iframeVideoElement.attr("src",this.videoSrc);
        this.iframeChatElement.attr("src",this.chatSrc);
    };

    Preview.prototype.stop = function () {
        this.iframeVideoElement.attr("src","about:blank");
        this.iframeChatElement.attr("src","about:blank");

        //reset to initial state
        this.reset();
    };

    Preview.prototype.reset = function () {
        //reset divs and buttons
        preview.css({width:this.defaultWidth,height:this.defaultHeight});
        expandBtn.show().css({transform:"translate(-50%,50%"});
        contractBtn.hide();
        closeBtn.show().css({transform:"translate(-50%,-50%)"});
    };

})();