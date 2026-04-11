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

@property (nonatomic, assign) BOOL forceLock;
@property (nonatomic, assign) BOOL lockDisabled;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardLockView : RCTView

@property (nonatomic, assign) BOOL forceLock;
@property (nonatomic, assign) BOOL lockDisabled;

@end

#endif


#endif /* RNCEKVExternalKeyboardLockView_h */
