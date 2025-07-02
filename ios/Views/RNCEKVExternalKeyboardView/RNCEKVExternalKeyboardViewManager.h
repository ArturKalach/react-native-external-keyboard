//
//  RNCEKVExternalKeyboardViewManager.h
//  RNCEKVExternalKeyboard
//
//  Created by Artur Kalach on 17.07.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#ifndef RNCEKVExternalKeyboardViewManager_h
#define RNCEKVExternalKeyboardViewManager_h

#import <React/RCTViewManager.h>


#define RCTK_SIMPLE_PROP(propName, propType, viewClass) \
RCT_CUSTOM_VIEW_PROPERTY(propName, propType, viewClass) \
{ \
    propType *value = json ? [RCTConvert propType:json] : nil; \
    view.propName = value; \
}

@interface RNCEKVExternalKeyboardViewManager : RCTViewManager
@end

#endif /* RNCEKVExternalKeyboardViewManager_h */
