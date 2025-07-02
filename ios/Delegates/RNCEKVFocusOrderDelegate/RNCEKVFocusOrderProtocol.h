//
//  RNCEKVFocusOrderProtocol.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVFocusOrderProtocol_h
#define RNCEKVFocusOrderProtocol_h

#import <UIKit/UIKit.h>

@protocol RNCEKVFocusOrderProtocol <NSObject>

@property (nonatomic, strong) NSString* orderGroup;
@property NSNumber* lockFocus;
@property NSNumber* orderPosition;
@property (nonatomic, strong) NSString* orderLeft;
@property (nonatomic, strong) NSString* orderRight;
@property (nonatomic, strong) NSString* orderUp;
@property (nonatomic, strong) NSString* orderDown;
@property NSString* orderForward;
@property NSString* orderBackward;
@property NSString* orderLast;
@property NSString* orderFirst;

@property (nonatomic, strong) NSString* orderId;

- (UIViewController *)reactViewController;
- (UIView *)getFocusTargetView;

@end

#endif /* RNCEKVFocusOrderProtocol_h */
