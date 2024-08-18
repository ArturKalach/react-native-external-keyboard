//
//  RCTFabricModalHostViewController+Focus.h
//  Pods
//
//  Created by Artur Kalach on 17/08/2024.
//

#ifndef RCTFabricModalHostViewController_Focus_h
#define RCTFabricModalHostViewController_Focus_h

    #ifdef RCT_NEW_ARCH_ENABLED
        #import "RCTFabricModalHostViewController.h"

        @interface RCTFabricModalHostViewController (Focus)

        @end

    #else
        #import "RCTModalHostViewController.h"

        @interface RCTModalHostViewController (Focus)

        @end
    #endif

#endif /* RCTFabricModalHostViewController_Focus_h */
