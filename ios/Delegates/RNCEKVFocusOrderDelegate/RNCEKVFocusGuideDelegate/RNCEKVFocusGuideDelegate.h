//
//  RNCEKVFocusGuideDelegate.h
//  Pods
//
//  Created by Artur Kalach on 16/07/2025.
//

#ifndef RNCEKVFocusGuideDelegate_h
#define RNCEKVFocusGuideDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVFocusGuideHelper.h"

@interface RNCEKVFocusGuideDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)view;

//- (void)setLeftGuide:(UIView *_Nullable)view;
//- (void)setRightGuide:(UIView *_Nullable)view;
//- (void)setUpGuide:(UIView *_Nullable)view;
//- (void)setDownGuide:(UIView *_Nullable)view;
//
//- (void)removeLeftGuide;
//- (void)removeRightGuide;
//- (void)removeUpGuide;
//- (void)removeDownGuide;

- (void)setIsFocused:(BOOL)value;

- (void)setGuideFor:(RNCEKVFocusGuideDirection)direction withView: (UIView *_Nonnull)view;
- (void)removeGuideFor:(RNCEKVFocusGuideDirection)direction;

@end

#endif /* RNCEKVFocusGuideDelegate_h */
