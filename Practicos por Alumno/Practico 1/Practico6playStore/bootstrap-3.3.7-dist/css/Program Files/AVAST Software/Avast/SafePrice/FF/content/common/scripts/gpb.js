(function(AvastSP, PROTO) {

  function gpbType (id, multilicity, typeFunc) {
    return {
        options: {},
        multiplicity: multilicity || PROTO.optional,
        type: typeFunc,
        id: id
    };
  }

  /* GPB Definition helper */ 
  GPBD = {
    bytes : function (id, repeated) {
      return gpbType(id, repeated, function() { return PROTO.bytes; } );
    },
    string : function (id, repeated) {
      return gpbType(id, repeated, function() { return PROTO.string; } );
    },
    bool : function (id, repeated) {
      return gpbType(id, repeated, function() { return PROTO.bool; } );
    },
    sint32 : function (id, repeated) {
      return gpbType(id, repeated, function() { return  PROTO.sint32; } );
    },
    sint64 : function (id, repeated) {
      return gpbType(id, repeated, function() { return  PROTO.sint64; } );
    },
    int32 : function (id, repeated) {
      return gpbType(id, repeated, function() { return  PROTO.int32; } );
    },
    int64 : function (id, repeated) {
      return gpbType(id, repeated, function() { return  PROTO.int64; } );
    },
    Double : function (id, repeated) {
      return gpbType(id, repeated, function() { return  PROTO.Double; } );
    },
    cType : gpbType
  };


  AvastSP.gpb = {};

  AvastSP.gpb.All = PROTO.Message("AvastSP.gpb.All", {

    LocalServerRequest : PROTO.Message("AvastSP.gpb.All.LocalServerRequest", {

      BrowserType: PROTO.Enum("AvastSP.gpb.All.LocalServerRequest.BrowserType", {
          INVALID :0,
          IE :1,
          FIREFOX :2,
          CHROME :3,
          OPERA :4,
          SAFARI :5
      }),

      CommandType: PROTO.Enum("AvastSP.gpb.All.LocalServerRequest.CommandType", {
          ACKNOWLEDGEMENT :1,
          SET_PROPERTY :3,
          SITECORRECT :4,
          SITECORRECT_STATISTICS :5,
          IS_SAFEZONE_AVAILABLE :6,
          SWITCH_TO_SAFEZONE :7,
          LOG_MESSAGE :9,
          GET_GUIDS :10,
          GET_PROPERTIES :11,
          IS_BANKING_SITE :12,
          IS_SAFEZONE_CUSTOM_SITE :13,
          SET_PROPERTIES : 14
      }),

      type:    GPBD.cType(1, PROTO.optional, function(){return AvastSP.gpb.All.LocalServerRequest.CommandType;} ),
      params:  GPBD.bytes(2, PROTO.repeated),
      browser: GPBD.cType(3, PROTO.optional, function(){return AvastSP.gpb.All.LocalServerRequest.BrowserType;} )
    }),

    LocalServerResponse : PROTO.Message("AvastSP.gpb.All.LocalServerResponse", {
      result: GPBD.bytes(1, PROTO.repeated),
      error:  GPBD.bytes(2),
    })

  });

  /*******************************************************************************
   * UrlInfo > Identity
   ******************************************************************************/
  AvastSP.gpb.All.BrowserType = PROTO.Enum("AvastSP.gpb.All.BrowserType", {
    CHROME : 0,
    FIREFOX : 1,
    IE : 2,
    OPERA : 3,
    SAFARI : 4,
    PRODUCTS : 5,
    VIDEO : 6
  });

  AvastSP.gpb.All.OS = PROTO.Enum("AvastSP.gpb.All.OS", {
    WIN : 1,
    MAC : 2,
    LINUX : 3,
    ANDROID : 4,
    IOS : 5
  });

  AvastSP.gpb.All.ExtensionType = PROTO.Enum("AvastSP.gpb.All.ExtensionType", {
    AOS :  1,
    SP :   2,
    AOSP : 3,                  // AOS + SP
    ABOS : 4                   // Avast Business Online Security
  });

  AvastSP.gpb.All.Identity = PROTO.Message('AvastSP.gpb.All.Identity',{
    guid:   GPBD.bytes(1),
    uuid :  GPBD.bytes(2),
    token : GPBD.bytes(3),
    auid :  GPBD.bytes(4),
    browserType :    GPBD.cType(5, PROTO.optional, function() { return  AvastSP.gpb.All.BrowserType; } ),
    token_verified : GPBD.sint32(6),
    ip_address :     GPBD.bytes(7),
    userid :         GPBD.bytes(8),
    browserVersion : GPBD.string(9),
    hwid :  GPBD.bytes(11)
  });


  /*******************************************************************************
   * UrlInfo > UrlInfo
   ******************************************************************************/
  AvastSP.gpb.All.UrlInfo = PROTO.Message('AvastSP.gpb.All.UrlInfo',{
    webrep :   GPBD.cType(1, PROTO.optional, function() { return AvastSP.gpb.All.WebRep; } ),
    phishing : GPBD.cType(2, PROTO.optional, function() { return AvastSP.gpb.All.PhishingNew; } ),
    blocker :  GPBD.cType(3, PROTO.optional, function() { return AvastSP.gpb.All.Blocker; } ),
    typo :     GPBD.cType(4, PROTO.optional, function() { return AvastSP.gpb.All.Typo; } ),
    safeShop : GPBD.cType(5, PROTO.optional, function() { return AvastSP.gpb.All.SafeShop; } ),
  });

  AvastSP.gpb.All.EventType = PROTO.Enum("AvastSP.gpb.All.EventType",{
    CLICK : 0,
    FRESHOPEN : 1,
    REOPEN : 2,
    TABFOCUS : 3
  });

  /*******************************************************************************
   * UrlInfo > UrlInfoRequest
   ******************************************************************************/
  AvastSP.gpb.All.UrlInfoRequest = PROTO.Message("AvastSP.gpb.All.UrlInfoRequest", {

    Request : PROTO.Message("AvastSP.gpb.All.UrlInfoRequest.Request", {
      uri:      GPBD.string(1, PROTO.repeated),
      callerid: GPBD.sint32(2),
      locale:   GPBD.string(3),
      apikey:   GPBD.bytes(4),
      identity: GPBD.cType(5, PROTO.optional, function() { return AvastSP.gpb.All.Identity; } ),
      visited:  GPBD.bool (6),
      udpateRequest: GPBD.cType(7, PROTO.optional, function() { return AvastSP.gpb.All.UpdateRequest; } ),
      requestedServices : GPBD.sint32(8),
      // customKeyValue : 9
      referer :     GPBD.string(10),
      windowNum :   GPBD.sint32(11),
      tabNum :      GPBD.sint32(12),
      windowEvent : GPBD.cType(13, PROTO.optional, function(){return  AvastSP.gpb.All.EventType;} ),
      // origin : 14 (OriginType) 
      dnl:          GPBD.bool (15),
      // fullUris: GPBD.string (16, PROTO.repeated),
      safeShop:     GPBD.int64(17),
        // -1 = opt-out,
        // 0 = opt-in, it is not in cache,
        // >0 = timestamp of the cached item
      client: GPBD.cType(18, PROTO.optional, function(){return  AvastSP.gpb.All.Client;} ),
    }),
    Response : PROTO.Message("AvastSP.gpb.All.UrlInfoRequest.Response", {
      urlInfo:        GPBD.cType(1, PROTO.repeated,  function() { return AvastSP.gpb.All.UrlInfo; } ),
      updateResponse: GPBD.cType(2, PROTO.optional, function() { return AvastSP.gpb.All.UpdateResponse; } )
    })
  });

  /*******************************************************************************
   * UrlInfo > Phishing
   ******************************************************************************/
  AvastSP.gpb.All.PhishingNew = PROTO.Message("AvastSP.gpb.All.PhishingNew", {
    phishing:       GPBD.sint32(1),
    phishingDomain: GPBD.sint32(2),
    ttl:            GPBD.sint32(3)
  });

  /*******************************************************************************
   * UrlInfo > Typo
   ******************************************************************************/
  AvastSP.gpb.All.Typo = PROTO.Message("AvastSP.gpb.All.Typo", {
    url_to:       GPBD.string(1),
    brand_domain: GPBD.string(2),
    urlInfo:      GPBD.cType(3, PROTO.optional, function(){return AvastSP.gpb.All.UrlInfo;} ),
    is_typo:      GPBD.bool(4)
  });

  /*******************************************************************************
   * UrlInfo > WebRep
   ******************************************************************************/
  AvastSP.gpb.All.WebRep = PROTO.Message("AvastSP.gpb.All.WebRep", {
    rating: GPBD.sint32(1),
    weight: GPBD.sint32(2),
    ttl:    GPBD.sint32(3),
    flags:  GPBD.sint64(4)
              // bit mask:
              //    shopping = 1
              //    social = 2
              //    news = 4
              //    it = 8
              //    corporate = 16
              //    pornography = 32
              //    violence = 64
              //    gambling = 128
              //    drugs = 256
              //    illegal = 512
  });

  /*******************************************************************************
   * UrlInfo > SafeShop
   ******************************************************************************/
  AvastSP.gpb.All.SafeShop = PROTO.Message("AvastSP.gpb.All.SafeShop", {
    timestamp : GPBD.int64(1),
    regex :     GPBD.string(2),
    selector :  GPBD.string(3)
  });

  /*******************************************************************************
   * UrlInfo > Blocker
   ******************************************************************************/
  AvastSP.gpb.All.Blocker = PROTO.Message("AvastSP.gpb.All.Blocker", {
    block: GPBD.sint64(1)
  });
  
  /* UrlInfo > Client */
  AvastSP.gpb.All.Client = PROTO.Message("AvastSP.gpb.All.Client", {
    id:             GPBD.cType(1, PROTO.optional, function(){return AvastSP.gpb.All.AvastIdentity;} ),  // all kinds of Avast's identities
    type:           GPBD.cType(2, PROTO.optional, function(){return AvastSP.gpb.All.Client.CType;} ),   // request's send-from source
    browserExtInfo: GPBD.cType(3, PROTO.optional, function(){return AvastSP.gpb.All.BrowserExtInfo;} ), // browser related information
    // optional MessageClientInfo messageClientInfo = 4;
    CType: PROTO.Enum('AvastSP.gpb.All.Client.CType', {
        TEST: 1,                   // testing requests
        AVAST: 2,                  // Avast embedded
        BROWSER_EXT: 3,            // from browser extensions
        MESSAGE: 4,                // send from Android message
        PARTNER: 5,                // third party partners.
        WEBSITE: 6                // reserved type, if we are going to deploy urlinfo service as a public online service
    })
  });
  
  /* UrlInfo > AvastIdentity */
  AvastSP.gpb.All.AvastIdentity = PROTO.Message("AvastSP.gpb.All.AvastIdentity", {
    guid :   GPBD.bytes(1),
    uuid :   GPBD.bytes(2),
    token :  GPBD.bytes(3),
    auid :   GPBD.bytes(4),
    userid : GPBD.bytes(5),
    hwid   : GPBD.bytes(6)
  });

  /* UrlInfo > BrowserExtInfo */
  AvastSP.gpb.All.BrowserExtInfo = PROTO.Message("AvastSP.gpb.All.BrowserExtInfo", {
    extensionType : GPBD.cType(1, PROTO.optional, function(){return AvastSP.gpb.All.ExtensionType;} ),
    extensionVersion : GPBD.sint32(2),
    browserType : GPBD.cType(3, PROTO.optional, function(){return AvastSP.gpb.All.BrowserType;} ),
    browserVersion : GPBD.string(4),
    os : GPBD.cType(5, PROTO.optional, function(){return AvastSP.gpb.All.OS;} ),
    osVersion : GPBD.string(6),
    dataVersion : GPBD.sint32(7)
  });
  /*******************************************************************************
   * Gamification > ApplicationEvent
   ******************************************************************************/
  AvastSP.gpb.All.ApplicationEvent = PROTO.Message('AvastSP.gpb.All.ApplicationEvent',{
    identity : GPBD.cType(1, PROTO.required, function() { return AvastSP.gpb.All.ApplicationIdentity; } ),
    event :    GPBD.cType(2, PROTO.required, function() { return AvastSP.gpb.All.GeneratedEvent; } ),
    source :   GPBD.cType(3, PROTO.required, function() { return AvastSP.gpb.All.ApplicationEvent.Source; } ),
    productInfomation : GPBD.cType(4, PROTO.optional, function() { return AvastSP.gpb.All.ProductInfomation; } ),

    Source : PROTO.Enum("AvastSP.gpb.All.ApplicationEvent.Source", {
      BROWSER_PLUGIN : 8
    })
  });

  /*******************************************************************************
   * Gamification > ApplicationIdentity
   ******************************************************************************/
  AvastSP.gpb.All.ApplicationIdentity = PROTO.Message('AvastSP.gpb.All.ApplicationIdentity', {
    type : GPBD.cType(1, PROTO.optional, function() { return AvastSP.gpb.All.ApplicationIdentity.ApplicationIdentityType; }),
    uuid : GPBD.string(2),
    auid : GPBD.string(6),
    hwid : GPBD.string(8),
    guid : GPBD.string(9),

    ApplicationIdentityType: PROTO.Enum('AvastSP.gpb.All.ApplicationIdentity.ApplicationIdentityType', {
      HW_IDENTITY : 7 //Contains hardwareId, guid auid, uuid
    })
  });

  /*******************************************************************************
   * Gamification > GeneratedEvent
   ******************************************************************************/
  AvastSP.gpb.All.GeneratedEvent = PROTO.Message('AvastSP.gpb.All.GeneratedEvent',{
    eventType: GPBD.int32 (1, PROTO.repeated),
    eventTime: GPBD.sint64(2, PROTO.required),
    params :   GPBD.cType (3, PROTO.repeated, function() { return AvastSP.gpb.All.GeneratedEvent.GeneratedEventParam; } ),

    GeneratedEventParam : PROTO.Message('AvastSP.gpb.All.GeneratedEvent.GeneratedEventParam', {
      paramName: GPBD.string(1, PROTO.required),
      value:     GPBD.string(2)
    })
  });

  /*******************************************************************************
   * Gamification > ProductInformation
   ******************************************************************************/
  AvastSP.gpb.All.ProductInformation = PROTO.Message('AvastSP.gpb.All.ProductInformation', {
    code :               GPBD.string(1, PROTO.repeated),
    version :            GPBD.bytes(2),
    platform :           GPBD.cType(3, PROTO.optional, function() { return AvastSP.gpb.All.ProductInformation.Platform; } ),
    plaformVersion :     GPBD.string(4),
    otherSpecification : GPBD.bytes(5),

    Platform: PROTO.Enum('AvastSP.gpb.All.ProductInformation.Platform', {
      WIN : 1,
      OSX : 2,
      IOS : 3,
      LINUX : 4,
      ANDROID : 5
    })
  });

  AvastSP.gpb.All.GamificationResponse = PROTO.Message('AvastSP.gpb.All.GamificationResponse', {
    status: GPBD.int32(1)
  });

(function(PROTO) {

/*******************************************************************************
 * > SafeShopOffer
 ******************************************************************************/
  AvastSP.gpb.All.SafeShopOffer = PROTO.Message("AvastSP.gpb.All.SafeShopOffer",{
    Request : PROTO.Message("AvastSP.gpb.All.SafeShopOffer.Request",{
      tag:      GPBD.string(1),
      campaign: GPBD.string(2),
      uuid:     GPBD.string(3),
      url:      GPBD.string(4),
      query:    GPBD.string(5),
      limit:    GPBD.string(6),
      identity: GPBD.cType(7, PROTO.optional, function() { return AvastSP.gpb.All.Identity; } ),
      status:   GPBD.cType(8, PROTO.optional, function() { return AvastSP.gpb.All.SafeShopOffer.Request.UserStatus; } ),
      country:  GPBD.string(9),
      voucherSearch : GPBD.bool(10),
      lang:     GPBD.string(11),
      referer:  GPBD.string(12),

      UserStatus: PROTO.Enum("AvastSP.gpb.All.SafeShopOffer.Request.UserStatus",{
          NEW : 0,
          OPT_IN : 1,
          OPT_OUT : 2
      })
    }),

    Response : PROTO.Message("AvastSP.gpb.All.SafeShopOffer.Response",{
        id: GPBD.string(1),
        status: GPBD.int32(2),
        morepending: GPBD.bool(3),
        query: GPBD.string(4),
        version: GPBD.string(5),
        items: GPBD.cType(6, PROTO.repeated, function() { return AvastSP.gpb.All.SafeShopOffer.Response.Item; } ),

        Item: PROTO.Message("AvastSP.gpb.All.SafeShopOffer.Response.Item",{
            offers: GPBD.cType(1, PROTO.repeated,  function() { return AvastSP.gpb.All.SafeShopOffer.Response.Offer; } ),
            url: GPBD.string(2)
        }),

        Offer: PROTO.Message("AvastSP.gpb.All.SafeShopOffer.Response.Offer",{
            affiliate: GPBD.string(1),
            affiliate_image: GPBD.string(2),
            availability: GPBD.string(3),
            availability_code: GPBD.string(4),
            category: GPBD.string(5),
            currency: GPBD.string(6),
            fprice: GPBD.string(7),
            fprice_sup: GPBD.string(8),
            image_url: GPBD.string(9),
            label: GPBD.string(10),
            label_quality: GPBD.string(11),
            description: GPBD.string(12),
            origin: GPBD.bool(13),
            price: GPBD.Double(14),
            priority: GPBD.int32(15),
            product_id: GPBD.string(16),
            saving: GPBD.string(17),
            shipping: GPBD.string(18),
            slug: GPBD.string(19),
            sortorder: GPBD.int64(20),
            templateref: GPBD.string(21),
            url: GPBD.string(22),
            coupon_exception: GPBD.string(23),
            coupon_existing_customers: GPBD.bool(24),
            coupon_expire_date: GPBD.string(25),
            coupon_expires: GPBD.int32(26),
            coupon_expires_df: GPBD.string(27),
            coupon_freeshipping: GPBD.bool(28),
            coupon_minimum_order_value: GPBD.string(29),
            coupon_new_customers: GPBD.string(30),
            domain_label: GPBD.string(31),
            value: GPBD.string(32),
            created: GPBD.string(33),
            external_id: GPBD.string(34),
            time: GPBD.int64(35),
            views: GPBD.int32(36),
            coupon_code : GPBD.string(37),
            coupon_text : GPBD.string(38)
        })
    }),
    PickedOffer: PROTO.Message("AvastSP.gpb.All.SafeShopOffer.PickedOffer",{
      Request: PROTO.Message("AvastSP.gpb.All.SafeShopOffer.PickedOffer.Request",{
        originalRequest: {
          options: {},
          multiplicity: PROTO.optional,
          type: function(){return AvastSP.gpb.All.SafeShopOffer.Request;},
          id: 1
        },
        offer: {
          options: {},
          multiplicity: PROTO.optional,
          type: function(){return AvastSP.gpb.All.SafeShopOffer.Response.Offer;},
          id: 2
        }
      }),
      Response: PROTO.Message("AvastSP.gpb.All.SafeShopOffer.PickedOffer.Response",{
      })
    })
  });

}).call(this, AvastSP.PROTO);

}).call(this, AvastSP, AvastSP.PROTO);