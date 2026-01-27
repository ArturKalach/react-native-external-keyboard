//
//  RNCEKVSwizzlingHelper.h
//  Pods
//
//  Created by Artur Kalach on 15/07/2025.
//

#ifndef RNCEKVSwizzlingHelper_h
#define RNCEKVSwizzlingHelper_h

#import <Foundation/Foundation.h>
#import <objc/runtime.h>

void RNCEKVSwizzleInstanceMethod(Class swizzleClass, SEL originalSelector, SEL swizzledSelector);

#endif /* RNCEKVSwizzlingHelper_h */
