/*! AeroGear JavaScript Library - v1.3.2 - 2014-01-28
* https://github.com/aerogear/aerogear-js
* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
(function( window, undefined ) {

/**
    The AeroGear namespace provides a way to encapsulate the library's properties and methods away from the global namespace
    @namespace
 */
this.AeroGear = {};

/**
    AeroGear.Core is a base for all of the library modules to extend. It is not to be instantiated and will throw an error when attempted
    @class
    @private
 */
AeroGear.Core = function() {
    // Prevent instantiation of this base class
    if ( this instanceof AeroGear.Core ) {
        throw "Invalid instantiation of base class AeroGear.Core";
    }

    /**
        This function is used by the different parts of AeroGear to add a new Object to its respective collection.
        @name AeroGear.add
        @method
        @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};
        this[ this.collectionName ] = collection;

        if ( !config ) {
            return this;
        } else if ( typeof config === "string" ) {
            // config is a string so use default adapter type
            collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config, this.config );
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current, this.config );
                } else {
                    if( current.name ) {

                        // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
                        current.settings = AeroGear.extend( current.settings || {}, this.config );

                        // Compatibility fix for deprecation of recordId in Pipeline and DataManager constructors
                        // Added in 1.3 to remove in 1.4
                        current.settings.recordId = current.settings.recordId || current.recordId;
                        // End compat fix

                        collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings );
                    }
                }
            }
        } else {
            if( !config.name ) {
                return this;
            }

            // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
            // config is an object so use that signature
            config.settings = AeroGear.extend( config.settings || {}, this.config );

            // Compatibility fix for deprecation of recordId in Pipeline and DataManager constructors
            // Added in 1.3 to remove in 1.4
            config.settings.recordId = config.settings.recordId || config.recordId;
            // End compat fix

            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings );
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
    /**
        This function is used internally by pipeline, datamanager, etc. to remove an Object (pipe, store, etc.) from the respective collection.
        @name AeroGear.remove
        @method
        @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object. See the particular constructor for the object calling .remove for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( typeof config === "string" ) {
            // config is a string so delete that item by name
            delete collection[ config ];
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    delete collection[ current ];
                } else {
                    delete collection[ current.name ];
                }
            }
        } else if ( config ) {
            // config is an object so use that signature
            delete collection[ config.name ];
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
};

/**
    Utility function to test if an object is an Array
    @private
    @method
    @param {Object} obj - This can be any object to test
*/
AeroGear.isArray = function( obj ) {
    return ({}).toString.call( obj ) === "[object Array]";
};

/**
    Utility function to merge 2 Objects together.
    @private
    @method
    @param {Object} obj1 - An Object to be merged.
    @param {Object} obj2 - An Object to be merged.  This Objects Value takes precendence.
*/
AeroGear.extend = function( obj1, obj2 ) {
    var name;
    for( name in obj2 ) {
        obj1[ name ] = obj2[ name ];
    }
    return obj1;
};

/**
    This callback is executed when an HTTP request completes whether it was successful or not.
    @callback AeroGear~completeCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
 */
/**
    This callback is executed when an HTTP error is encountered during a request.
    @callback AeroGear~errorCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
 */
/**
    This callback is executed when an HTTP success message is returned during a request.
    @callback AeroGear~successCallbackREST
    @param {Object} data - The data, if any, returned in the response
    @param {String} textStatus - The text status message returned from the server
    @param {Object} jqXHR - The jQuery specific XHR object
 */
 /**
    This callback is executed when an HTTP progress message is returned during a request.
    @callback AeroGear~progressCallbackREST
    @param {Object} XMLHttpRequestProgressEvent - The progress event
 */
/**
    This callback is executed when an error is encountered saving to local or session storage.
    @callback AeroGear~errorCallbackStorage
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
    @param {Object|Array} data - An object or array of objects representing the data for the failed save attempt.
 */
/**
    This callback is executed when data is successfully saved to session or local storage.
    @callback AeroGear~successCallbackStorage
    @param {Object} data - The updated data object after the new saved data has been added
 */

/**
    The AeroGear.Pipeline provides a persistence API that is protocol agnostic and does not depend on any certain data model. Through the use of adapters, this library provides common methods like read, save and delete that will just work.
    @status Stable
    @class
    @augments AeroGear.Core
    @param {String|Array|Object} [config] - A configuration for the pipe(s) being created along with the Pipeline. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the pipe will later be referenced by
    @param {String} [config.type="Rest"] - the type of pipe as determined by the adapter used
    @param {String} [config.recordId="id"] - @deprecated the identifier used to denote the unique id for each record in the data associated with this pipe
    @param {Object} [config.authenticator=null] - the AeroGear.auth object used to pass credentials to a secure endpoint
    @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
    @returns {Object} pipeline - The created Pipeline containing any pipes that may have been created
    @example
// Create an empty Pipeline
var pl = AeroGear.Pipeline();

// Create a single pipe using the default adapter
var pl2 = AeroGear.Pipeline( "tasks" );

// Create multiple pipes using the default adapter
var pl3 = AeroGear.Pipeline( [ "tasks", "projects" ] );

//Create a new REST pipe with a custom ID using an object
var pl4 = AeroGear.Pipeline({
    name: "customPipe",
    type: "rest",
    settings: {
        recordId: "CustomID"
    }
});

//Create multiple REST pipes using objects
var pl5 = AeroGear.Pipeline([
    {
        name: "customPipe",
        type: "rest",
        settings: {
            recordId: "CustomID"
        }
    },
    {
        name: "customPipe2",
        type: "rest",
        settings: {
            recordId: "CustomID"
        }
    }
]);
 */
AeroGear.Pipeline = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Pipeline ) ) {
        return new AeroGear.Pipeline( config );
    }

    // Super constructor
    AeroGear.Core.call( this );

    // Save a reference to the Pipeline Config
    this.config = config || {};

    this.lib = "Pipeline";
    this.type = config ? config.type || "Rest" : "Rest";

    /**
        The name used to reference the collection of pipe instances created from the adapters
        @memberOf AeroGear.Pipeline
        @type Object
        @default pipes
     */
    this.collectionName = "pipes";

    this.add( config );
};

AeroGear.Pipeline.prototype = AeroGear.Core;
AeroGear.Pipeline.constructor = AeroGear.Pipeline;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.Pipeline namespace dynamically and still be accessible to the add method
    @augments AeroGear.Pipeline
 */
AeroGear.Pipeline.adapters = {};

/**
    The REST adapter is the default type used when creating a new pipe. It uses jQuery.ajax to communicate with the server. By default, the RESTful endpoint used by this pipe is the app's current context, followed by the pipe name. For example, if the app is running on http://mysite.com/myApp, then a pipe named `tasks` would use http://mysite.com/myApp/tasks as its REST endpoint.
    This constructor is instantiated when the "PipeLine.add()" method is called
    @status Stable
    @constructs AeroGear.Pipeline.adapters.Rest
    @param {String} pipeName - the name used to reference this particular pipe
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {Object} [settings.authenticator=null] - @deprecated the AeroGear.auth object used to pass credentials to a secure endpoint
    @param {String} [settings.baseURL] - defines the base URL to use for an endpoint
    @param {String} [settings.contentType="application/json"] - the default type of content being sent to the server
    @param {String} [settings.dataType="json"] - the default type of data expected to be returned from the server
    @param {String} [settings.endpoint=pipename] - overrides the default naming of the endpoint which uses the pipeName
    @param {Object|Boolean} [settings.pageConfig] - an object containing the current paging configuration, true to use all defaults or false/undefined to not use paging
    @param {String} [settings.pageConfig.metadataLocation="webLinking"] - indicates whether paging information is received from the response "header", the response "body" or via RFC 5988 "webLinking", which is the default.
    @param {String} [settings.pageConfig.previousIdentifier="previous"] - the name of the prev link header, content var or web link rel
    @param {String} [settings.pageConfig.nextIdentifier="next"] - the name of the next link header, content var or web link rel
    @param {Function} [settings.pageConfig.parameterProvider] - a function for handling custom parameter placement within header and body based paging - for header paging, the function receives a jqXHR object and for body paging, the function receives the JSON formatted body as an object. the function should then return an object containing keys named for the previous/nextIdentifier options and whos values are either a map of parameters and values or a properly formatted query string
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @param {Number} [settings.timeout=60] - the amount of time, in seconds, to wait before timing out a connection and firing the complete callback for that request
    @param {Object} [settings.xhrFields] - specify extra xhr options, like the withCredentials flag
    @returns {Object} The created pipe
    @example
    //Create an empty pipeline
    var pipeline = AeroGear.Pipeline();

    //Add a new Pipe with a custom baseURL, custom endpoint and default paging turned on
    pipeline.add( "customPipe", {
        baseURL: "http://customURL.com",
        endpoint: "customendpoint",
        pageConfig: true
    });

    //Add a new Pipe with a custom paging options
    pipeline.add( "customPipe", {
        pageConfig: {
            metadataLocation: "header",
            previousIdentifier: "back",
            nextIdentifier: "forward"
        }
    });

 */
AeroGear.Pipeline.adapters.Rest = function( pipeName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Pipeline.adapters.Rest ) ) {
        return new AeroGear.Pipeline.adapters.Rest( pipeName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var endpoint = settings.endpoint || pipeName,
        ajaxSettings = {
            // use the pipeName as the default rest endpoint
            url: settings.baseURL ? settings.baseURL + endpoint : endpoint,
            contentType: settings.contentType || "application/json",
            dataType: settings.dataType || "json",
            xhrFields: settings.xhrFields
        },
        recordId = settings.recordId || "id",
        authenticator = settings.authenticator || null,
        type = "Rest",
        pageConfig = settings.pageConfig,
        timeout = settings.timeout ? settings.timeout * 1000 : 60000;

    // Privileged Methods
    /**
        Returns the value of the private ajaxSettings var
        @private
        @augments Rest
        @returns {Object}
     */
    this.getAjaxSettings = function() {
        return ajaxSettings;
    };

    /**
        Returns the value of the private authenticator var
        @private
        @augments Rest
        @returns {AeroGear.Authenticator}
     */
    this.getAuthenticator = function() {
        return authenticator;
    };

    /**
        Returns the value of the private recordId var
        @private
        @augments Rest
        @returns {String}
     */
    this.getRecordId = function() {
        return recordId;
    };

    /**
        Returns the value of the private timeout var
        @private
        @augments Rest
        @returns {Number}
     */
    this.getTimeout = function() {
        return timeout;
    };

    /**
        Returns the value of the private pageConfig var
        @private
        @augments Rest
        @returns {Object}
     */
    this.getPageConfig = function() {
        return pageConfig;
    };

    /**
        Updates the value of the private pageConfig var with only the items specified in newConfig unless the reset option is specified
        @private
        @augments Rest
     */
    this.updatePageConfig = function( newConfig, reset ) {
        if ( reset ) {
            pageConfig = {};
            pageConfig.metadataLocation = newConfig.metadataLocation ? newConfig.metadataLocation : "webLinking";
            pageConfig.previousIdentifier = newConfig.previousIdentifier ? newConfig.previousIdentifier : "previous";
            pageConfig.nextIdentifier = newConfig.nextIdentifier ? newConfig.nextIdentifier : "next";
            pageConfig.parameterProvider = newConfig.parameterProvider ? newConfig.parameterProvider : null;
        } else {
            jQuery.extend( pageConfig, newConfig );
        }
    };

    // Set pageConfig defaults
    if ( pageConfig ) {
        this.updatePageConfig( pageConfig, true );
    }

    // Paging Helpers
    this.webLinkingPageParser = function( jqXHR ) {
        var linkAr, linksAr, currentLink, params, paramAr, identifier,
            query = {};

        linksAr = jqXHR.getResponseHeader( "Link" ).split( "," );
        for ( var link in linksAr ) {
            linkAr = linksAr[ link ].trim().split( ";" );
            for ( var item in linkAr ) {
                currentLink = linkAr[ item ].trim();
                if ( currentLink.indexOf( "<" ) === 0 && currentLink.lastIndexOf( ">" ) === linkAr[ item ].length - 1 ) {
                    params = currentLink.substr( 1, currentLink.length - 2 ).split( "?" )[ 1 ];
                } else if ( currentLink.indexOf( "rel=" ) === 0 ) {
                    if ( currentLink.indexOf( pageConfig.previousIdentifier ) >= 0 ) {
                        identifier = pageConfig.previousIdentifier;
                    } else if ( currentLink.indexOf( pageConfig.nextIdentifier ) >= 0 ) {
                        identifier = pageConfig.nextIdentifier;
                    }
                }
            }

            if( identifier ) {
                query[ identifier ] = params;
                identifier = undefined;
            }
        }

        return query;
    };

    this.headerPageParser = function( jqXHR ) {
        var previousQueryString = jqXHR.getResponseHeader( pageConfig.previousIdentifier ),
            nextQueryString = jqXHR.getResponseHeader( pageConfig.nextIdentifier ),
            pagingMetadata = {},
            query = {};

        if ( pageConfig.parameterProvider ) {
            pagingMetadata = pageConfig.parameterProvider( jqXHR );
            query[ pageConfig.previousIdentifier ] = pagingMetadata[ pageConfig.previousIdentifier ];
            query[ pageConfig.nextIdentifier ] = pagingMetadata[ pageConfig.nextIdentifier ];
        } else {
            query[ pageConfig.previousIdentifier ] = previousQueryString ? previousQueryString.split( "?" )[ 1 ] : null;
            query[ pageConfig.nextIdentifier ] = nextQueryString ? nextQueryString.split( "?" )[ 1 ] : null;
        }

        return query;
    };

    this.bodyPageParser = function( body ) {
        var query = {},
            pagingMetadata = {};

        if ( pageConfig.parameterProvider ) {
            pagingMetadata = pageConfig.parameterProvider( body );

            query[ pageConfig.previousIdentifier ] = pagingMetadata[ pageConfig.previousIdentifier ];
            query[ pageConfig.nextIdentifier ] = pagingMetadata[ pageConfig.nextIdentifier ];
        } else {
            query[ pageConfig.previousIdentifier ] = body[ pageConfig.previousIdentifier ];
            query[ pageConfig.nextIdentifier ] = body[ pageConfig.nextIdentifier ];
        }

        return query;
    };

    this.formatJSONError = function( xhr ) {
        if ( this.getAjaxSettings().dataType === "json" ) {
            try {
                xhr.responseJSON = JSON.parse( xhr.responseText );
            } catch( error ) {
                // Response was not JSON formatted
            }
        }
        return xhr;
    };
};

// Public Methods
/**
    Reads data from the specified endpoint
    @param {Object} [options={}] - Additional options
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - a callback to be called when the request to the server results in an error
    @param {Object} [options.id] - the value to append to the endpoint URL,  should be the same as the pipelines recordId
    @param {Mixed} [options.jsonp] - Turns jsonp on/off for reads, Set to true, or an object with options
    @param {String} [options.jsonp.callback] - Override the callback function name in a jsonp request. This value will be used instead of 'callback' in the 'callback=?' part of the query string in the url
    @param {String} [options.jsonp.customCallback] - Specify the callback function name for a JSONP request. This value will be used instead of the random name automatically generated by jQuery
    @param {Number} [options.limitValue=10] - the maximum number of results the server should return when using a paged pipe
    @param {String} [options.offsetValue="0"] - the offset of the first element that should be included in the returned collection when using a paged pipe
    @param {Object|Boolean} [options.paging] - this object can be used to overwrite the default paging parameters to request data from other pages or completely customize the paging functionality, leaving undefined will cause paging to use defaults, setting to false will turn off paging and request all data for this single read request
    @param {Object} [options.query] - a hash of key/value pairs that can be passed to the server as additional information for use when determining what data to return
    @param {Object} [options.statusCode] - a collection of status codes and callbacks to fire when the request to the server returns on of those codes. For more info see the statusCode option on the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @param {AeroGear~successCallbackREST} [options.success] - a callback to be called when the result of the request to the server is successful
    @returns {Object} The jqXHR created by jQuery.ajax. To cancel the request, simply call the abort() method of the jqXHR object which will then trigger the error and complete callbacks for this request. For more info, see the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @example
var myPipe = AeroGear.Pipeline( "tasks" ).pipes[ 0 ];

// Get a set of key/value pairs of all data on the server associated with this pipe
var allData = myPipe.read();

// A data object can be passed to filter the data and in the case of REST,
// this object is converted to query string parameters which the server can use.
// The values would be determined by what the server is expecting
var filteredData = myPipe.read({
    query: {
        limit: 10,
        date: "2012-08-01"
        ...
    }
});

    @example
//JSONP - Default JSONP call to a JSONP server
myPipe.read({
    jsonp: true,
    success: function( data ){
        .....
    }
});

//JSONP - JSONP call with a changed callback parameter
myPipe.read({
    jsonp: {
        callback: "jsonp"
    },
    success: function( data ){
        .....
    }
});

    @example
//Paging - using the default weblinking protocal
var defaultPagingPipe = AeroGear.Pipeline([{
    name: "webLinking",
    settings: {
        endpoint: "pageTestWebLink",
        pageConfig: true
    }
}]).pipes[0];

//Get a limit of 2 pieces of data from the server, starting from the first page
//Calling the "next" function will get the next 2 pieces of data, if available.
//Similarily, calling the "previous" function will get the previous 2 pieces of data, if available
defaultPagingPipe.read({
    offsetValue: 1,
    limitValue: 2,
    success: function( data, textStatus, jqXHR ) {
        data.next({
            success: function( data ) {
                data.previous({
                    success: function() {
                    }
                });
            }
        });
    }
});

//Create a new Pipe with a custom paging options
var customPagingPipe = AeroGear.Pipeline([{
    name: "customPipe",
    settings: {
        pageConfig: {
            metadataLocation: "header",
            previousIdentifier: "back",
            nextIdentifier: "forward"
        }
    }
}]).pipes[0];

//Even with custom options, you use "next" and "previous" the same way
customPagingPipe.read({
    offsetValue: 1,
    limitValue: 2,
    success: function( data, textStatus, jqXHR ) {
        data.next({
            success: function( data ) {
                data.previous({
                    success: function() {
                    }
                });
            }
        });
    }
});
 */
AeroGear.Pipeline.adapters.Rest.prototype.read = function( options ) {
    var url, success, error, extraOptions,
        that = this,
        recordId = this.getRecordId(),
        ajaxSettings = this.getAjaxSettings(),
        pageConfig = this.getPageConfig();

    options = options ? options : {};
    options.query = options.query ? options.query : {};

    if ( options[ recordId ] ) {
        url = ajaxSettings.url + "/" + options[ recordId ];
    } else {
        url = ajaxSettings.url;
    }

    // Handle paging
    if ( pageConfig && options.paging !== false ) {
        // Set custom paging to defaults if not used
        if ( !options.paging ) {
            options.paging = {
                offset: options.offsetValue || 0,
                limit: options.limitValue || 10
            };
        }

        // Apply paging to request
        options.query = options.query || {};
        for ( var item in options.paging ) {
            options.query[ item ] = options.paging[ item ];
        }
    }

    success = function( data, textStatus, jqXHR ) {
        var paramMap;

        // Generate paged response
        if ( pageConfig && options.paging !== false ) {
            paramMap = that[ pageConfig.metadataLocation + "PageParser" ]( pageConfig.metadataLocation === "body" ? data : jqXHR );

            [ "previous", "next" ].forEach( function( element ) {
                data[ element ] = (function( pipe, parameters, options ) {
                    return function( callbacks ) {
                        options.paging = true;
                        options.offsetValue = options.limitValue = undefined;
                        options.query = parameters;
                        options.success = callbacks && callbacks.success ? callbacks.success : options.success;
                        options.error = callbacks && callbacks.error ? callbacks.error : options.error;

                        return pipe.read( options );
                    };
                })( that, paramMap[ pageConfig[ element + "Identifier" ] ], options );
            });
        }

        if ( options.success ) {
            options.success.apply( this, arguments );
        }
    };
    error = function( jqXHR, textStatus, errorThrown ) {
        jqXHR = that.formatJSONError( jqXHR );
        if ( options.error ) {
            options.error.apply( this, arguments );
        }
    };
    extraOptions = {
        type: "GET",
        data: options.query,
        success: success,
        error: error,
        url: url,
        statusCode: options.statusCode,
        complete: options.complete,
        headers: options.headers,
        timeout: this.getTimeout()
    };

    if( options.jsonp ) {
        extraOptions.dataType = "jsonp";
        extraOptions.jsonp = options.jsonp.callback ? options.jsonp.callback : "callback";
        if( options.jsonp.customCallback ) {
            extraOptions.jsonpCallback = options.jsonp.customCallback;
        }
    }

    return jQuery.ajax( jQuery.extend( {}, this.getAjaxSettings(), extraOptions ) );
};

/**
    Save data asynchronously to the server. If this is a new object (doesn't have a record identifier provided by the server), the data is created on the server (POST) and then that record is sent back to the client including the new server-assigned id, otherwise, the data on the server is updated (PUT).
    @param {Object} data - For new data, this will be an object representing the data to be saved to the server. For updating data, a hash of key/value pairs one of which must be the `recordId` you set during creation of the pipe representing the identifier the server will use to update this record and then any other number of pairs representing the data. The data object is then stringified and passed to the server to be processed.  To upload a File,  pass in a File or Blob object.  *IE Users - File Upload is only supported in IE 10 and above*
    @param {Object} [options={}] - Additional options
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - a callback to be called when the request to the server results in an error
    @param {Object} [options.statusCode] - a collection of status codes and callbacks to fire when the request to the server returns on of those codes. For more info see the statusCode option on the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @param {AeroGear~successCallbackREST} [options.success] - a callback to be called when the result of the request to the server is successful
    @param {AeroGear~progressCallbackREST} [options.progress] - a callback that is a hook to monitor the upload progress when uploading a File.( if available )
    @returns {Object} The jqXHR created by jQuery.ajax. To cancel the request, simply call the abort() method of the jqXHR object which will then trigger the error and complete callbacks for this request. For more info, see the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @example
    var myPipe = AeroGear.Pipeline( "tasks" ).pipes[ 0 ];

    // Store a new task
    myPipe.save({
        title: "Created Task",
        date: "2012-07-13",
        ...
    });

    // Pass a success and error callback, in this case using the REST pipe and jQuery.ajax so the functions take the same parameters.
    myPipe.save({
        title: "Another Created Task",
        date: "2012-07-13",
        ...
    },
    {
        success: function( data, textStatus, jqXHR ) {
            console.log( "Success" );
        },
        error: function( jqXHR, textStatus, errorThrown ) {
            console.log( "Error" );
        }
    });

    // Update an existing piece of data
    var toUpdate = {
        id: "Some Existing ID",
        title: "Updated Task"
    }
    myPipe.save( toUpdate );
 */
AeroGear.Pipeline.adapters.Rest.prototype.save = function( data, options ) {
    var that = this,
        recordId = this.getRecordId(),
        ajaxSettings = this.getAjaxSettings(),
        type,
        url,
        success,
        error,
        extraOptions,
        formData,
        key;

    data = data || {};
    options = options || {};
    type = data[ recordId ] ? "PUT" : "POST";

    if ( data[ recordId ] ) {
        url = ajaxSettings.url + "/" + data[ recordId ];
    } else {
        url = ajaxSettings.url;
    }

    success = function( data, textStatus, jqXHR ) {
        if ( options.success ) {
            options.success.apply( this, arguments );
        }
    };
    error = function( jqXHR, textStatus, errorThrown ) {
        jqXHR = that.formatJSONError( jqXHR );
        if ( options.error ) {
            options.error.apply( this, arguments );
        }
    };
    extraOptions = jQuery.extend( {}, ajaxSettings, {
        data: data,
        type: type,
        url: url,
        success: success,
        error: error,
        statusCode: options.statusCode,
        complete: options.complete,
        headers: options.headers,
        timeout: this.getTimeout()
    });

    // Check to see if there is a file and create a FormData Object to upload
    if( "FormData" in window ) {
        formData = new FormData();
        for( key in data ) {
            formData.append( key, data[ key ] );

            if( data[ key ] instanceof File || data[ key ] instanceof Blob ) {
                //Options to tell jQuery not to process data or worry about content-type.
                extraOptions.contentType = false;
                extraOptions.processData = false;
            }
        }

        if( extraOptions.contentType === false ) {
            extraOptions.data = formData;
        }

        // the jqXHR doesn't expose upload progress, so we need to create a custom xhr object
        extraOptions.xhr = function() {
            var myXhr = jQuery.ajaxSettings.xhr();
            if( myXhr.upload ){
                myXhr.upload.addEventListener( "progress", function() {
                    if( options.progress ) {
                        options.progress.apply( this, arguments );
                    }
                }, false );
            }
            return myXhr;
        };
    }
    // Stringify data if we actually want to POST/PUT JSON data
    if ( extraOptions.contentType === "application/json" && extraOptions.data && typeof extraOptions.data !== "string" ) {
        extraOptions.data = JSON.stringify( extraOptions.data );
    }

    return jQuery.ajax( jQuery.extend( {}, this.getAjaxSettings(), extraOptions ) );
};

/**
    Remove data asynchronously from the server. Passing nothing will inform the server to remove all data at this pipe's endpoint.
    @param {String|Object} [data] - A variety of objects can be passed to specify the item(s) to remove
    @param {Object} [options={}] - Additional options
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - a callback to be called when the request to the server results in an error
    @param {Object} [options.statusCode] - a collection of status codes and callbacks to fire when the request to the server returns on of those codes. For more info see the statusCode option on the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @param {AeroGear~successCallbackREST} [options.success] - a callback to be called when the result of the request to the server is successful
    @returns {Object} The jqXHR created by jQuery.ajax. To cancel the request, simply call the abort() method of the jqXHR object which will then trigger the error and complete callbacks for this request. For more info, see the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @example
    var myPipe = AeroGear.Pipeline( "tasks" ).pipes[ 0 ];

    // Store a new task
    myPipe.save({
        title: "Created Task",
        id: 1
    });

    // Store another new task
    myPipe.save({
        title: "Another Created Task",
        id: 2
    });

    // Store one more new task
    myPipe.save({
        title: "And Another Created Task",
        id: 3
    });

    // Remove a particular item from the server by its id
    myPipe.remove( 1 );

    // Delete all remaining data from the server associated with this pipe
    myPipe.remove();
 */
AeroGear.Pipeline.adapters.Rest.prototype.remove = function( toRemove, options ) {
    var that = this,
        recordId = this.getRecordId(),
        ajaxSettings = this.getAjaxSettings(),
        delPath = "",
        delId,
        url,
        success,
        error,
        extraOptions;

    if ( typeof toRemove === "string" || typeof toRemove === "number" ) {
        delId = toRemove;
    } else if ( toRemove && toRemove[ recordId ] ) {
        delId = toRemove[ recordId ];
    } else if ( toRemove && !options ) {
        // No remove item specified so treat as options
        options = toRemove;
    }

    options = options || {};

    delPath = delId ? "/" + delId : "";
    url = ajaxSettings.url + delPath;

    success = function( data, textStatus, jqXHR ) {
        if ( options.success ) {
            options.success.apply( this, arguments );
        }
    };
    error = function( jqXHR, textStatus, errorThrown ) {
        jqXHR = that.formatJSONError( jqXHR );
        if ( options.error ) {
            options.error.apply( this, arguments );
        }
    };
    extraOptions = {
        type: "DELETE",
        url: url,
        success: success,
        error: error,
        statusCode: options.statusCode,
        complete: options.complete,
        headers: options.headers,
        timeout: this.getTimeout()
    };

    return jQuery.ajax( jQuery.extend( {}, ajaxSettings, extraOptions ) );
};
})( this );
