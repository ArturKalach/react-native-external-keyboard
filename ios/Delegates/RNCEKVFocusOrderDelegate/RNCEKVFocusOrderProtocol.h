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
@property (nonatomic, strong) NSNumber* lockFocus;
@property (nonatomic, strong) NSNumber* orderPosition;
@property (nonatomic, strong) NSString* orderLeft;
@property (nonatomic, strong) NSString* orderRight;
@property (nonatomic, strong) NSString* orderUp;
@property (nonatomic, strong) NSString* orderDown;
@property (nonatomic, strong) NSString* orderForward;
@property (nonatomic, strong) NSString* orderBackward;
@property (nonatomic, strong) NSString* orderLast;
@property (nonatomic, strong) NSString* orderFirst;
@property (nonatomic, strong) NSString* orderId;

- (UIView *)getFocusTargetView;

@end

#endif /* RNCEKVFocusOrderProtocol_h */
