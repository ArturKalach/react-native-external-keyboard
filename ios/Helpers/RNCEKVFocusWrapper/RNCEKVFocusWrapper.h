//
//  FocusWrapper.h
//  ExternalKeyboard
//
//  Created by Artur Kalach on 21.06.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#ifndef RNCEKVFocusWrapper_h
#define RNCEKVFocusWrapper_h


#import <UIKit/UIKit.h>
#import <UIKit/UIAccessibilityContainer.h>
#import <React/RCTView.h>

#import "RNCEKVKeyboardKeyPressHandler.h"

@interface RNCEKVFocusWrapper : RCTView {
    RNCEKVKeyboardKeyPressHandler* _keyboardKeyPressHandler;
}

@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTBubblingEventBlock onFocusChange;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyDownPress;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyUpPress;

@end


#endif /* FocusWrapper_h */
