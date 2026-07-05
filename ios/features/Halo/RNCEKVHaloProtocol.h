//
//  RNCEKVHaloProtocol.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVHaloProtocol_h
#define RNCEKVHaloProtocol_h

#import <UIKit/UIKit.h>

@protocol RNCEKVHaloProtocol <NSObject>

- (BOOL)isHaloHidden;
- (CGFloat) haloCornerRadius;
- (CGFloat) haloExpendX;
- (CGFloat) haloExpendY;
- (BOOL) roundedHaloFix;
- (UIView*) getFocusTargetView;

@end

#endif /* RNCEKVHaloProtocol_h */
