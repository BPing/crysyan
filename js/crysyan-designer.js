(function() {
    //
    function getRandomString() {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
    }
    /**
     *   CrysyanDesigner
     *
     * @param {object}   config
     * @param {Function} callback
     *                                   called after iframe has been loaded.
     *                                   'CrysyanDesigner' instance  as a parameter to pass to it.
     */
    function CrysyanDesigner(config, callback) {
        var designer = this;
        designer.appendTo = function(parentNode) {
            designer.iframe = document.createElement('iframe');
            designer.iframe.name = config.ifrName ? config.ifrName : "default-iframe" + getRandomString();
            designer.iframe.uid = designer.iframe.name;
            designer.iframe.src = (config.projectPath || "") + "crysyan.html?config=" + JSON.stringify(config);
            designer.iframe.style.width = '100%';
            designer.iframe.style.height = '100%';
            designer.iframe.style.border = 0;
            designer.iframe.onload = function() {
                callback(designer);
            };
            parentNode.appendChild(designer.iframe);
        };
        designer.destroy = function() {
            if (designer.iframe) {
                designer.iframe.parentNode.removeChild(designer.iframe);
                designer.iframe = null;
            }
        };
        designer.getView = function() {
            return window[designer.iframe.uid].Crysyan.getView();
        };
        /**
         * @param  {[File|Image|DataUrl]} img
         */
        designer.drawBackgroupWithImage = function(img) {
            var view = window[designer.iframe.uid].Crysyan.getView();
            view.crysyanCanvas.drawBackgroupWithImage(img, 1);
        };

        designer.toDataUrl = function() {
            var view = window[designer.iframe.uid].Crysyan.getView();
            return view.crysyanCanvas.toDataURL("image/png");
        };

    }

    // jquery Plug-in
    $.fn.CrysyanDesigner = function(config, callback) {
        var designer = this;
        designer.each(function() {
            var a = new CrysyanDesigner(config, callback).appendTo(this);
        });
    };

    window.CrysyanDesigner = CrysyanDesigner;
})();
