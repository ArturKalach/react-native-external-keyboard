//
//  TintColorView.h
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#ifndef TintColorView_h
#define TintColorView_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVTintColorView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVTintColorView : RCTView
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* TintColorView_h */
