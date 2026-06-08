//
//  RNCEKVHaloDelegate.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVHaloDelegate_h
#define RNCEKVHaloDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVHaloProtocol.h"

@interface RNCEKVHaloDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVHaloProtocol> *_Nonnull)view;

@property (nonatomic, readonly, nullable) UIFocusEffect *focusEffect API_AVAILABLE(ios(15.0));
- (void)observeCornerRadius:(CGFloat)radius;
- (void)invalidate;
- (void)clear;

@end

#endif /* RNCEKVHaloDelegate_h */
