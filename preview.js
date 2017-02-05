/**
 * Created by baultik on 2/2/17.
 */
    var embedPreview = null;
    var timer = null;

    $(document).ready(function() {
        embedPreview = new Preview();
        embedPreview.init();

        var body = $("body");
        body.on('click','.grid-item',(function(){
            updatePreview(this);
        }));

        body.on('click','.grid-item-f',(function(){
            updatePreview(this);
        }));
        $("#add_watch").on('click',function(){
            getFavorite(this);
        });
        $(window).resize(function () {
            onResize(500,updateFullScreen);
        });
    });
    function getFavorite(parent){
        console.log("This is:" , parent);
        // var index = $(parent).attr('data-index');
        // var item = main_array[index];
        // var channel = item.channel;
        // addToWatch(channel)
    }
    function updatePreview(parent){
        var index = $(parent).attr('data-index');
        var item = main_array[index];
        console.log("Channel" ,item);
        embedPreview.play(item);
    }
    function addToWatch(channel){
        this.watchList = [];
        if(user){
            console.log("We have a user");
        }
          this.watchList.push(channel)
        }
    ;
    //TODO: account for window resizing
    function updateFullScreen() {
        if (embedPreview.expanded) {
            embedPreview.position(0);
        }
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
        this.preview = $('#preview');
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
        this.mobile = false;
        this.addWatch = $("#add_watch");
    }

    Preview.prototype.init = function () {
        //get initial size
        this.defaultWidth = this.preview.width();
        this.defaultHeight = this.preview.height();

        this.preview.on('click','#close_preview',this.stop.bind(this));
        this.preview.on('click','#open_full',this.expand.bind(this));
        this.preview.on('click','#close_full',this.contract.bind(this));
        //Create iframes - used until preview is close
        this.iframeChatElement = $("<iframe>",
            {frameborder:"0",scrolling:"no",width:this.defaultWidth+"px",height:this.defaultHeight+"px",src:"about:blank"})
            .css({position: "absolute",display:"inline-block",left:"0",top:"0"});
        this.preview.append(this.iframeChatElement);

        this.iframeVideoElement = $("<iframe>",
            {frameborder:"0",scrolling:"no",width:this.defaultWidth+"px",height:this.defaultHeight+"px",src:"about:blank"})
            .css({position: "absolute",display:"inline-block",left:"0",top:"0"});
        this.preview.append(this.iframeVideoElement);
    };

    Preview.prototype.expand = function () {
        //get buttons and hide them
        this.contractBtn.hide();
        this.expandBtn.hide();
        this.closeBtn.hide();
        this.expanded = true;//save state

        //animate position
        this.position(this.animationTime, function () {
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
        this.position(this.animationTime, function () {
            //show appropriate buttons
            this.closeBtn.css({transform:"translate(-50%,-50%)"});
            this.expandBtn.show();
            this.closeBtn.show();
        });
    };

    Preview.prototype.position = function (time,callback) {
        if (time === undefined) time = this.animationTime;
        callback = callback ? callback.bind(this) : function () {};

        //get main div and content div and sizes
        var prevWidth = this.defaultWidth, prevHeight = this.defaultHeight;
        var contentWidth = prevWidth, contentHeight = prevHeight, contentLeft = 0;

        //set up sizes for video and chat and position for chat
        var vWidth = contentWidth,  cWidth = vWidth;
        var vHeight = contentHeight, cHeight = vHeight;
        var top = 0, left = contentLeft;

        if (this.expanded) {
            //if fullscreen changes sizes to fullscreen layout
            prevWidth = $(window).width();
            prevHeight = $(window).height();
            contentWidth = prevWidth - this.expandedBtnGutter;
            contentHeight = prevHeight;
            contentLeft = this.expandedBtnGutter;
            vWidth = cWidth = contentWidth;
            vHeight = cHeight = contentHeight;
            left = contentLeft;

            //If fullscreen account for if screen is taller than wide - otherwise use default sizes with chat hidden
            if (contentHeight > contentWidth) {
                //Make video full width at appropriate aspect ratio with chat filling below
                vHeight = contentWidth * 0.5625;

                top = vHeight;
                cHeight = contentHeight - top;
            } else {
                //Make video and chat side by side
                vWidth = contentWidth * 0.75;

                left = vWidth + contentLeft;
                cWidth = contentWidth - vWidth;
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

        //On mobile and smaller window sizes - only do expanded view
        if (this.defaultWidth > $(window).width()) {
            this.contractBtn.hide();
            this.expandBtn.hide();
            this.closeBtn.css({transform:"none"});
            this.mobile = true;
        } else {
            this.mobile = false;
            this.reset();
        }
        this.expanded = this.mobile;
        this.position(0);
        this.preview.show();
    };

    Preview.prototype.stop = function () {
        this.preview.hide();
        this.iframeVideoElement.attr("src","about:blank");
        this.iframeChatElement.attr("src","about:blank");

        //reset to initial state
        this.reset();
    };

    Preview.prototype.reset = function () {
        //reset divs and buttons
        if (!this.mobile) {
            this.preview.css({width: this.defaultWidth, height: this.defaultHeight});
            this.expandBtn.show().css({transform: "translate(-50%,50%"});
            this.contractBtn.hide();
            this.closeBtn.show().css({transform: "translate(-50%,-50%)"});
        }
    };