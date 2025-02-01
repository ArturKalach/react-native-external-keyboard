//
//  RNCEKVHaloProtocol.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVHaloProtocol_h
#define RNCEKVHaloProtocol_h

@protocol RNCEKVHaloProtocol <NSObject>

- (NSNumber *)isHaloActive;
- (CGFloat) haloCornerRadius;
- (CGFloat) haloExpendX;
- (CGFloat) haloExpendY;
- (UIView*) getFocusTargetView;

@end

#endif /* RNCEKVHaloProtocol_h */
