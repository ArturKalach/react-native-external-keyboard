//
//  RNCEKVExternalKeyboardLockView.h
//  Pods
//
//  Created by Artur Kalach on 27/01/2026.
//

#ifndef RNCEKVExternalKeyboardLockView_h
#define RNCEKVExternalKeyboardLockView_h


#import <UIKit/UIKit.h>



#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVExternalKeyboardLockView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardLockView : RCTView
@end

#endif


#endif /* RNCEKVExternalKeyboardLockView_h */
